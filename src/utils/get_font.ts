import { dirname } from "path";
import { fileURLToPath } from "url";
import { convert_woff2_tff, download_font, install_font } from ".";
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function get_font(n: number) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    let path_split = __dirname.split("\\");
    path_split.splice(path_split.length - 1, path_split.length);

    path_split = [...path_split, "tmp", "fonts"];
    await download_font(n, path_split);
    // console.log('wtf')    
    await convert_woff2_tff(n, path_split);
    await install_font(n, path_split); // TODO: install font
    return [...path_split, `p${n}.ttf`].join("\\");
}