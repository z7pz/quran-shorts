import { Verses } from ".";
import { IListWord, IListImage } from "./interfaces";

type Type = "words" | "image";
interface IOptions<T extends Type> {
  recitation: number;
  surah: number;
  type: T;
  translations: number;
  page: number;
  limit: number;
  offset: number
}

export class GET {
  private options: IOptions<Type> = {
    recitation: 1,
    surah: 1,
    type: "words",
    translations: 21,
    page: 1,
    limit: 10,
    offset: 0
  };
  constructor(public verses: Verses) {}
  async list<T extends Type = "words">(options?: Partial<IOptions<T>>) {
    let clone = this.options;
    Object.assign(clone, options ?? {});
    return (
      await this.verses.api.axios.get<T extends "words" ? IListWord : IListImage>(
        `chapters/${clone.surah}/verses?recitation=${clone.recitation}&translations=${clone.translations}&language=en&text_type=${clone.type}&limit=${clone.limit}&offset=${clone.offset}&page=${clone.page}`
      )
    ).data;
  }
}
