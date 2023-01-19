import wawoff2 from "wawoff2";
import fs from "fs/promises";
import { join } from "path";

export async function convert_woff2_tff(n: number, fontsDir: string) {
	const woff2Buffer = await fs.readFile(
		join(fontsDir, `p${n}.woff2`)
	);
	const compressed = Uint8Array.from(woff2Buffer);
	const decompressed = await wawoff2.decompress(compressed);
	await fs.writeFile(join(fontsDir, `p${n}.ttf`), decompressed);
}
