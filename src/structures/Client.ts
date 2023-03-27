import PQueue from "p-queue";
import Editly, { Layer } from "editly";
import { upload } from "youtube-videos-uploader";
import { Credentials, Video } from "youtube-videos-uploader/dist/types";
import { executablePath, Touchscreen } from "puppeteer";
import fs from "fs/promises";

import { Api } from ".";
import { Logger, get_font } from "../utils";
import { surahs } from "../constants";
import { ClientManager } from "./ClientManager";
import { IVerseImage } from "./api/verses/interfaces";

interface IBuildRes {
	name: string;
	description: string;
	surah: number;
	offset: number;
}

interface IUploadOptions {
	surah: number;
	offset: number;
}

export class Client {
	api = new Api();
	logger: Logger;
	constructor({ debug }: { debug: boolean }) {
		this.logger = new Logger(debug);
	}

	async getRandomBackground() {
		const assets = await fs.readdir("assets");
		return assets[Math.floor(Math.random() * assets.length)];
	}

	async run({
		surah,
		offset,
		recitation,
	}: {
		surah: number;
		offset: number;
		recitation: number;
	}) {
		console.log(surah, offset);
		if (surah > 114) {
			throw Error("Last surah is 114, you can't get beyond that.");
		}
		/**
		 * "current" is length of the video
		 * "page" verse count
		 * verses
		 */
		let current = 0; //
		let page = 1; // verse number
		let verses: IVerseImage[] = []; // verses
		while (true) {
			/**
			 * Get Image list
			 * because Image has duration, and Words doesn't
			 */
			const list = await this.api.verses.get.list({
				recitation: recitation,
				offset,
				limit: 1,
				page: page,
				type: "image",
				surah: surah,
			});
			if (list.pagination.total_count < offset + page) {
				break;
			}
			let duration = list.verses[0].audio.duration ?? 0;
			if (duration + current >= 60) {
				if (verses.length > 0) {
					break;
				}
				offset = offset + 1;
				continue;
			}
			verses.push(list.verses[0]);
			page++;
			current += duration;
		}
		if (verses.length === 0) return false;

		/**
		 * return client managuer class to process:
		 * - download audio files (mp3)
		 */

		return new ClientManager(
			page,
			current,
			verses,
			surah,
			offset,
			this.logger
		);
	}
	async build(
		offset: number,
		surah: number,
		i: number,
		recitation: number
	): Promise<IBuildRes> {
		const downloader = await this.run({ surah: surah, offset, recitation });
		if (downloader == false) {
			return await this.build(0, surah + 1, i, recitation);
		}
		let dont = false;

		const files = await downloader.download();
		let total_duration = files
			.map((file) => file.duration)
			.reduce((prev, curr) => prev + curr);
		let start = 0;
		// TODO: add system of addition to be perfect
		let addition = 0.3;
		let with_addition = total_duration + files.length * addition;
		if (with_addition > 60) {
			dont = true;
		}
		let add = dont ? addition : addition;
		this.logger.debug(
			dont ? "there is no addition." : "there is addition",
			`with addition: ${with_addition}`
		);
		/**
		 * building the layers for PQueu so we can await them with same concurrency
		 */
		const layers = files
			.map((file) => {
				return async () => {
					// create text layer for Quran
					const text = {
						originX: "center",
						originY: "center",
						type: "title",
						// get,  download and install the font
						fontPath: await get_font(file.font),
						text: file.words
							.map((word) => {
								let htmlEntity = word.code;
								let codePoint =
									htmlEntity.match(/x([\da-fA-F]+)/)![1];
								let hexCode = codePoint.toUpperCase();
								let character = String.fromCharCode(
									parseInt(hexCode, 16)
								);
								return character;
							})
							.join(" "),
						start: start,
						stop: start + file.duration - 0.1,
					} as Layer;
					// create voice layer of the (mp3) file
					const voice = {
						type: "detached-audio",
						start: start + add,
						stop: start + add + file.duration,
						path: file.name,
					} as Layer;
					start += file.duration;
					return [voice, text] as Layer[];
				};
			})
			.flatMap((v) => v);
		/**
		 * await all layers with same concurrency
		 */
		const lays = (
			await new PQueue({ concurrency: 1 }).addAll(layers)
		).flatMap((v) => v);
		/**
		 * build video with Edily editor
		 */
		await Editly({
			verbose: false,
			fast: this.logger.active,
			keepSourceAudio: false,
			outPath: `output.mp4`,
			height: 1920,
			width: 1080,
			defaults: {
				transition: null,
			},
			clips: [
				{
					duration: total_duration + files.length * add,
					layers: [
						{
							type: "image-overlay",
							path:
								"assets/" + (await this.getRandomBackground()),
						},
						...lays,
					],
				},
			],
		});

		return {
			name: `${surahs[surah - 1].name}`,
			description: `${surahs[surah - 1].name}`,
			surah,
			offset: downloader.offset + files.length,
		};
	}

	async upload(video: IBuildRes) {
		const credentials = {
			email: process.env.email,
			pass: process.env.password,
			recoveryemail: process.env.recoveryEmail || undefined,
		} as Credentials;

		const onVideoUploadSuccess = (videoUrls: string) => {
			console.log(videoUrls);
		};

		const video1 = {
			path: `output.mp4`,
			title: video.name,
			description: "description 1",
			isNotForKid: true,
			onSuccess: onVideoUploadSuccess,
			skipProcessingWait: true,
		} as Video;
		await upload(credentials, [video1], {
			executablePath: executablePath(),
		}).then(console.log);
	}
}
