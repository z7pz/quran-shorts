import { Verses } from ".";
import { IList } from "./interfaces";

interface IOptions {
  recitation: number;
  surah: number;
  type: "words" | "image";
  translations: number;
}

export class GET {
  private options: IOptions = {
    recitation: 1,
    surah: 1,
    type: "words",
    translations: 21,
  };
  constructor(public verses: Verses) {}
  async list(options?: Partial<IOptions>) {
    let clone = this.options;
    Object.assign(clone, options ?? {});
    return (
      await this.verses.api.axios.get<IList>(
        `chapters/${clone.surah}/verses?recitation=${clone.recitation}&translations=${clone.translations}&language=en&text_type=${clone.type}`
      )
    ).data;
  }
}
