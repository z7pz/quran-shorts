import { Api } from "./api";
import { IListImage } from "./api/verses/interfaces.js";
import axios from "axios";
import fs from "fs";
import https from 'https'
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
      let png = `${verse.image.url.split("/")[verse.image.url.split("/").length - 1]}`;
      let pathmp3 = path_split.join("\\") + `\\tmp\\${mp3}`;
      let pathpng = path_split.join("\\") + `\\tmp\\${png}`;
      paths.push({
        name: pathmp3,
        text: pathpng,
        duration: verse.audio.duration,
      });

      let instance = axios.create({
        httpsAgent: new https.Agent({  
          rejectUnauthorized: false
        })
      })
      const res = await instance({
        method: "get",
        url: `http://verses.quran.com/${verse.audio.url}`,
        responseType: "stream",
      });
      const res2 = await instance({
        method: "get",
        url: `https:${verse.image.url}`,
        responseType: "stream",
      });
      res.data.pipe(fs.createWriteStream(pathmp3));
      res2.data.pipe(fs.createWriteStream(pathpng));
    });
    await Promise.all(promises);

    return paths as { name: string; duration: number; text: string }[];
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
        recitation: 5,
        offset,
        limit: 1,
        page: page,
        type: "image",
        surah: surah,
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
