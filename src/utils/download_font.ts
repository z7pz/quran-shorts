import axios from "axios";
import fs, { cpSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Downloader from "nodejs-file-downloader";
import EasyDl from "easydl"
export async function download_font(n: number, path_split: string[]) {
  // fix: downloading woff2
  return await new Promise<string>(async (res, rej) => {
    const path_font = [...path_split, `p${n}.woff2`].join("\\");
    // const downloader = new Downloader({
    //   url: `https://quran.com/fonts/quran/hafs/v1/woff2/p${n}.woff2`, //If the file name already exists, a new file with the name 200MB1.zip is created.
    //   directory: "./src/tmp/fonts", //This folder will be created, if it doesn't exist.
    //   "cloneFiles": false
    // });

    // const { filePath, downloadStatus } = await downloader.download();

    // res(filePath);
    const results = await axios({
      method: "get",
      url: `https://quran.com/fonts/quran/hafs/v1/woff2/p${n}.woff2`,
      responseType: "stream",
    });
    results.data.pipe(fs.createWriteStream(path_font));
    console.log('downloaded')
    res("test")
  });
}
