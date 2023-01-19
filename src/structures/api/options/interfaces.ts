type TLanguage = "english" | "arabic";
interface ITranslatedName {
	name: string;
	language_name: string; // lang
}
interface IRecitation {
	id: number;
	reciter_name: string;
	style: string;
	translated_name: ITranslatedName;
}
export interface IRecitations {
	recitations: IRecitation[];
}

interface ITranslation {
	id: number;
	name: string;
	author_name: string;
	slug: string;
	language_name: TLanguage;
	translated_name: ITranslatedName;
}

export interface ITranslations {
	translations: ITranslation[];
}

interface ITafsir {
	id: number;
	name: string;
	author_name: string;
	slug: string;
	language_name: TLanguage;
	translated_name: ITranslatedName;
}

export interface ITafsirs {
	tafsirs: ITafsir[];
}
