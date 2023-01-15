import axios from "axios";
import { createWriteStream } from "fs";
import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
export async function downloadFile(
  fileUrl: string,
  outputLocationPath: string
) {
  const writer = createWriteStream(outputLocationPath);

  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}
export async function download_font(n: number, path_split: string[]) {
  const path_font = [...path_split, `p${n}.woff2`].join("\\");

  await downloadFile(
    `https://quran.com/fonts/quran/hafs/v1/woff2/p${n}.woff2`,
    path_font
  );
  // console.log("done?");
}
