import { dirname } from "path";
import { fileURLToPath } from "url";
import { convert_woff2_tff, download_font, install_font } from ".";
export async function get_font(n: number) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	let path_split = __dirname.split("\\");
	path_split.splice(path_split.length - 1, path_split.length);
	path_split = [...path_split, "tmp", "fonts"];
	const cont = await download_font(n, path_split);
	if (cont) return [...path_split, `p${n}.ttf`].join("\\");
	await convert_woff2_tff(n, path_split);
	await install_font(n);
	return [...path_split, `p${n}.ttf`].join("\\");
}
