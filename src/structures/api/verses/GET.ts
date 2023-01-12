import { Verses } from ".";

export class GET {
  constructor(public verses: Verses) {}
  async list(
    recitation = 1,
    surah = 1,
    type: "image" | "words" = "words",
    translations = 21
  ) {
    return (
      await this.verses.api.axios.get(
        `chapters/${surah}/verses?recitation=${recitation}&translations=${translations}&language=en&text_type=${type}`
      )
    ).data;
  }
}
