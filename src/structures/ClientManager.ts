import { dirname } from "path";
import { fileURLToPath } from "url";
import { downloadFile, Logger } from "../utils";
import { Api } from "./api";
import { IListImage } from "./api/verses/interfaces";

export class ClientManager {
  api = new Api();
  constructor(
    public page: number,
    public current: number,
    public verses: IListImage["verses"],
    public surah: number,
    public offset: number,
    public logger: Logger
  ) {}
  getAudio() {
    return this.verses.map((verse) => [verse.audio.url, verse.audio.duration]);
  }
  /**
   * get verses (words type) because it has Qurani words with the end of the verse
   */
  async getVerses() {
    const words = this.verses.map(async (verse, i) => {
      return await this.api.verses.get.list({
        offset: this.offset,
        limit: this.page,
        surah: this.surah,
        type: "words",
      });
    });
    const res = await Promise.all(words);
    return res;
  }
  /**
   * get the words (as indopak) of the verses (from getVerses function) with font name (p)
   */
  async getWords() {
    let verses = await this.getVerses();
    const words = verses[0].verses.map((verse) => {
      return {
        id: verse.id,
        words: verse.words.map((word, i) => {
          return {
            i,
            text: word.text_indopak,
            code: word.code,
            p: word.class_name,
          };
        }),
      };
    });
    return words;
  }
  /**
   * download audio files (mp3)
   */
  async download() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    let path_split = __dirname.split("\\");
    path_split.splice(path_split.length - 1, path_split.length);
    let paths: IPaths[] = [];
    let promises = this.verses.map(async (verse, i) => {
      let mp3 = `${verse.audio.url.split("mp3")[1].replace("/", "")}mp3`;
      let pathmp3 = path_split.join("\\") + `\\tmp\\audio\\${mp3}`;
      const verses_words = await this.getWords();
      const ver = verses_words[i];
      paths.push({
        i: ver.id,
        font: parseInt(ver.words[0].p.replace("p", "")),
        name: pathmp3,
        words: ver.words,
        duration: verse.audio.duration,
      });

      await downloadFile(`http://verses.quran.com/${verse.audio.url}`, pathmp3);
    });
    await Promise.all(promises);
    return paths.sort((a, b) => a.i - b.i) as IPaths[];
  }
}
