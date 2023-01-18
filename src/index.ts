import { config } from "dotenv";
import { Client } from "../src/structures/Client";
config();
const client = new Client(true);
(async () => {
	let surah = 1;
	let offset = 0;
	let create = 1;
	let i = 0;
	while (create > i) {
		const video = await client.build(offset, surah, i);
		if(!client.logger.active) await client.upload(video);
		surah = video.surah;
		offset = video.offset;
		i++;
	}
})();
