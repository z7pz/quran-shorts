import { Client } from "../src/structures/Client";

const client = new Client();
(async () => {
  let surah = 1;
  let offset = 0;
  let create = 3;
  let i = 0;
  while (create > i) {
    const video = await client.build(offset, surah, i);
    const res = await client.upload(video);
    surah = res.surah;
    offset = res.offset;
    i++;
  }
})();
