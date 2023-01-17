declare type TLanguage = "english" | "arabic";
declare type TAuthors = ""; // TODO
declare interface IBuildRes {
  name: string;
  description: string;
  surah: number;
  offset: number;
}
declare interface IPaths {
  i: number;
  name: string;
  duration: number;
  font: number;
  words: {
    i: number;
    text: string;
    code: string;
    p: string;
  }[];
}

declare interface IUploadOptions {
  surah: number;
  offset: number;
}
