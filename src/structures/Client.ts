import { Api } from "./api";
import { IListImage } from "./api/verses/interfaces.js";
import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
class CalculatorManager {
  constructor(
    public page: number,
    public current: number,
    public verses: IListImage["verses"]
  ) {}
  getAudio() {
    return this.verses.map((verse) => [verse.audio.url, verse.audio.duration]);
  }
  async download() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    let path_split = __dirname.split("\\");
    path_split.splice(path_split.length - 1, path_split.length);
    console.log(path_split.join("\\"));
    let paths = [];
    let promises = this.verses.map(async (verse) => {
      let mp3 = `${verse.audio.url.split("mp3")[1].replace("/", "")}mp3`;
      let path = path_split.join("\\") + `\\tmp\\${mp3}`;
      paths.push({
        name: path,
        duration: verse.audio.duration,
      });
      const res = await axios({
        method: "get",
        url: `https://verses.quran.com/${verse.audio.url}`,
        responseType: "stream",
      });
      res.data.pipe(fs.createWriteStream(path));
    });
    await Promise.all(promises);

    return paths as { name: string; duration: number }[];
  }
}

export class Client {
  api = new Api();
  constructor() {}
  async calculate({ surah, offset }: { surah: number; offset: number }) {
    let current = 0; // video length
    let page = 1; // verse number
    let verses = []; // verses
    while (true) {
      const list = await this.api.verses.get.list({
        offset,
        limit: 1,
        page: page,
        type: "image",
        surah: 2,
      });
      let duration = list.verses[0].audio.duration ?? 0;
      if (duration + current > 60) {
        break;
      }
      verses.push(list.verses[0]);
      page++;
      current += duration;
    }
    return new CalculatorManager(page, current, verses);
  }
  build() {
    // build the video and download it into the pc files
  }
  upload() {
    // uploading short into youtube
  }
}
