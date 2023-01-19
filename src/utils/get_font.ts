import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { convert_woff2_tff, download_font, install_font } from ".";
export async function get_font(n: number) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const fontsDir = join(__dirname, "..", "tmp", "fonts");
	const available = await download_font(n, fontsDir);
	if (available) return join(fontsDir, `p${n}.ttf`);
	await convert_woff2_tff(n, fontsDir);
	await install_font(n);
	return join(fontsDir, `p${n}.ttf`);
}
