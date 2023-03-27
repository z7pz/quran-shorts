import { readFile } from "fs/promises";
import { join } from "path";
import { downloadFile } from ".";

export async function download_font(n: number, fontsDir: string) {
	const test = await readFile(join(fontsDir, `p${n}.ttf`)).catch(
		() => true
	);
	if (test !== true) return true;
	await downloadFile(
		`https://quran.com/fonts/quran/hafs/v1/woff2/p${n}.woff2`,
		join(fontsDir, `p${n}.woff2`)
	);
	return false;
}
