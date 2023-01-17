import { readFile } from "fs/promises";
import { downloadFile } from "./download_stream";

export async function download_font(n: number, path_split: string[]) {
	const path_font = [...path_split, `p${n}.woff2`].join("\\");
	const test = await readFile(path_font).catch(() => true);
	if (test !== true) return true;
	await downloadFile(
		`https://quran.com/fonts/quran/hafs/v1/woff2/p${n}.woff2`,
		path_font
	);
	return false;
}
