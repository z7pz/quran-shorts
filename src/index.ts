import { config as env } from "dotenv";
import { Client } from "../src/structures/Client";
import config from "../config.json" assert { type: "json" };
import axios from "axios";
env();

const client = new Client({
	debug: config.debug,
});
(async () => {
	// configurations
	let surah = config.surah;
	let offset = config.verse - 1;
	let create = config.create;

	// remove console functions from global obj, and copy them into a new obj
	let _console = {} as Console;
	if (!client.logger.active) {
		Object.entries(console).forEach(([key, value]) => {
			_console[key] = value;
			console[key] = () => {};
		});
		// we need this for Error throwing
		console.error = _console.error;
	} else {
		// expecting this to be empty obj
		_console = console;
	}


	// get all recitations
	const { data: res } = await axios.get<{
		recitations: {
			id: number;
			reciter_name: string; // english
			style?: "string";
			translated_name: {
				name: string; // arabic
				language_name: "arabic" | "english";
			};
		}[];
	}>("http://api.quran.com/api/v3/options/recitations?language=ar");

	// user can pass either name of the recitation or the id of him
	// NOTE: name both work for (ar, en)
	let recitation = config.recitation as string | number;

	// check user input if it's a number
	function isNum(r: unknown): r is number {
		return !isNaN(Number(r));
	}
	// check user input if it's a string
	function isStr(r: unknown): r is string {
		return typeof r == "string";
	}
	// try to find the recitation
	const rec = res.recitations.find(
		(data) =>
			(isNum(recitation) && data.id == recitation) ||
			(isStr(recitation) && data.reciter_name == recitation) ||
			(isStr(recitation) && data.translated_name.name == recitation)
	);

	if (!rec) {
		throw Error("Recitation not found!!");
	}

	let i = 0;
	while (create > i) {
		const video = await client.build(offset, surah, i, rec.id);
		if (!client.logger.active) await client.upload(video);
		surah = video.surah;
		offset = video.offset;
		i++;
	}
	console.log("All done!");
})();
