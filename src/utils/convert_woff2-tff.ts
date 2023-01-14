import woff2 from "woff2";
import fs from "fs/promises";

export async function convert_woff2_tff(n: number, path_split: string[]) {
    // Read the WOFF2 font file
var woff2Buffer = await fs.readFile([...path_split, `p${n}.woff2`].join("\\"));

// Convert the WOFF2 font to TFF
var ttfBuffer = woff2.decode(woff2Buffer);

// Save the TFF font file
await fs.writeFile([...path_split, `p${n}.tff`].join("\\"), ttfBuffer);

}