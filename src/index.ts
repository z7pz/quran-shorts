import { config as env } from "dotenv";
import { Client } from "../src/structures/Client";
import config from "../config.json" assert { type: "json" };
env();

const client = new Client({
	debug: true,
});
(async () => {
	// configurations
	let surah = config.surah;
	let offset = config.verse - 1;
	let create = config.create;

	let i = 0;
	while (create > i) {
		const video = await client.build(offset, surah, i);
		if (!client.logger.active) await client.upload(video);
		surah = video.surah;
		offset = video.offset;
		i++;
	}
})();
