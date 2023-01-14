import woff2 from "woff2";
import fs from "fs/promises";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function convert_woff2_tff(n: number, path_split: string[]) {
  // Read the WOFF2 font file
  try {
    console.log("reading file");
    console.log([...path_split, `p${n}.woff2`]);
    var woff2Buffer = await fs.readFile(
      [...path_split, `p${n}.woff2`].join("\\")
    );
    sleep(500)    

    // Convert the WOFF2 font to TFF
    var ttfBuffer = woff2.decode(woff2Buffer);
    sleep(500)    

    // Save the TFF font file
    await fs.writeFile([...path_split, `p${n}.ttf`].join("\\"), ttfBuffer);
  } catch (err) {
    console.log(err)
  }
}
