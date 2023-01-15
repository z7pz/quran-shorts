import wawoff2 from "wawoff2";
import fs from "fs/promises";
import { read, readFileSync } from "fs";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function convert_woff2_tff(n: number, path_split: string[]) {
  // Read the WOFF2 font file
    // console.log("reading file");
    // console.log([...path_split, `p${n}.woff2`].join("\\"));
    var woff2Buffer = await fs.readFile(
      [...path_split, `p${n}.woff2`].join("\\")
    );
    sleep(500)
    const file_decompressed = Uint8Array.from(
      woff2Buffer
    );
     const test = await wawoff2.decompress(file_decompressed);
     fs.writeFile([...path_split, `p${n}.ttf`].join("\\"),test);
      // console.log(test)
    // // Convert the WOFF2 font to TFF
    // var ttfBuffer = woff2.decode(woff2Buffer);
    // sleep(500)

    // // Save the TFF font file
    // await fs.writeFile([...path_split, `p${n}.ttf`].join("\\"), ttfBuffer);
}
