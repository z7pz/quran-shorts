import { Verses } from ".";
import { Type, TVerses } from "./interfaces";

interface IOptions<T extends Type> {
	recitation: number;
	surah: number;
	type: T;
	translations: number;
	page: number;
	limit: number;
	offset: number;
}

export class GET {
	private options: IOptions<Type> = {
		recitation: 1,
		surah: 1,
		type: "words",
		translations: 21,
		page: 1,
		limit: 10,
		offset: 0,
	};
	constructor(public verses: Verses) {}
	async list<T extends Type = "words">(options?: Partial<IOptions<T>>) {
		Object.assign(this.options, options ?? {});
		return (
			await this.verses.api.axios.get<TVerses<T>>(
				`chapters/${this.options.surah}/verses?recitation=${this.options.recitation}&translations=${this.options.translations}&language=en&text_type=${this.options.type}&limit=${this.options.limit}&offset=${this.options.offset}&page=${this.options.page}`
			)
		).data;
	}
}
