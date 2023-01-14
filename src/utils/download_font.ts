import axios from "axios";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
export async function download_font(n: number, path_split: string[]) {
  // fix: downloading woff2
  return new Promise<void>(async (res, rej) => {
    const path_font = [...path_split, `p${n}.woff2`].join("\\");
    const results = await axios({
      method: "get",
      url: `https://quran.com/fonts/quran/hafs/v1/woff2/p${n}.woff2`,
      responseType: "stream",
    });
    const d = fs.createWriteStream(path_font);
    results.data.pipe(d);
    d.on("finish", () => {
      console.log("test")
      res();
    });
  });
}
