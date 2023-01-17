import { config } from "dotenv";
import { Client } from "../src/structures/Client";
config();
const client = new Client();
(async () => {
  let surah = 2;
  let offset = 32;
  let create = 1;
  let i = 0;
  while (create > i) {
    const video = await client.build(offset, surah, i);
    const res = await client.upload(video);
    surah = res.surah;
    offset = res.offset;
    i++;
  }
})();
