import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { downloadFile, Logger } from "../utils";
import { Api } from "./api";
import { IListImage } from "./api/verses/interfaces";
import PQueue from "p-queue";

interface IPaths {
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
		return this.verses.map((verse) => [
			verse.audio.url,
			verse.audio.duration,
		]);
	}
	/**
	 * get verses (words type) because it has Qurani words with the end of the verse
	 */
	async getVerses() {
		const words = this.verses.map((_verse, i) => {
			return async () => {
				this.logger.debug("getting verses words of verse " + i);
				return await this.api.verses.get.list({
					offset: this.offset,
					limit: this.page,
					surah: this.surah,
					type: "words",
				});
			};
		});
		this.logger.debug(`getting words of ${this.verses.length} verse.`);
		const res = await new PQueue().addAll(words);
		return res;
	}
	/**
	 * get the words and get important things from it
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
		let paths: IPaths[] = [];
		this.logger.debug(`downloading ${this.verses.length} mp3 file.`);
		let promises = this.verses.map((verse, i) => {
			return async () => {
				let mp3 = `${verse.audio
					.url!.split("mp3")[1]
					.replace("/", "")}mp3`;
				let pathmp3 = join(__dirname, "..", "tmp", "audio", mp3);
				const verses_words = await this.getWords();
				const ver = verses_words[i];
				paths.push({
					i: ver.id,
					font: parseInt(ver.words[0].p.replace("p", "")),
					name: pathmp3,
					words: ver.words,
					duration: verse.audio.duration!,
				});
				this.logger.debug(mp3 + " downloading.");
				await downloadFile(
					`http://verses.quran.com/${verse.audio.url}`,
					pathmp3
				);
				this.logger.debug(mp3 + " downloaded.");
			};
			// FIX ME
		});
		await new PQueue({ concurrency: 1 }).addAll(promises);
		this.logger.debug(`all ${this.verses.length} mp3 downloaded.`);
		// await Promise.all(promises);
		return paths;
	}
}
