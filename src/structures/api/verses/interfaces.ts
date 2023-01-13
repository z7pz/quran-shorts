type TVerseKey = `${number}:${number}`;
interface IWord {
  id: number;
  position: number;
  text_indopak: string;
  verse_key: TVerseKey;
  line_number: number;
  page_number: number;
  code: string; // "&#xfb51;"
  class_name: string; // "p1"
  text_madani: string;
  char_type: string; // word // type
  transliteration: {
    text: string;
    language_name: TLanguage;
  };
  translation: {
    language_name: TLanguage;
    text: string;
  };
  audio: {
    url: string | null; // "wbw/001_001_001.mp3", null cuz of the number of Aea
    duration: number;
    segments: [[number, number, number, number]]; // [[number, number, number, number]]
  };
}
interface IVerse {
  id: number;
  verse_number: number;
  chapter_id: number;
  verse_key: TVerseKey;
  text_indopak: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  sajdah_number: null | number;
  page_number: number;
  sajdah: null | number;
  text_madani: string;
  words: IWord[];
}
interface IPagination {
  current_page: number;
  next_page: null | number;
  prev_page: null | number;
  total_pages: number;
  total_count: number;
}
export interface IList {
  verses: IVerse[];
  pagination: IPagination;
}
