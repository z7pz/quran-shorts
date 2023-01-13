import { Api } from "./api";

export class Client {
  api = new Api();
  constructor() {}
  async calculate({ surah, offset }) {
    let current = 0; // video length
    let page = 1; // verse number
    let verses = [];  // verses
    while (true) {
      const list = await this.api.verses.get.list({
        limit: 1,
        page: page,
        type: "image",
        surah: 2,
      });
      let duration = list.verses[0].audio.duration ?? 0;
      if (duration + current > 60) {
        break;
      }
      verses.push(list.verses[0])
      page++
      current += duration;
    }
    return {
        page,
        current,
        verses
    };
  }
}
