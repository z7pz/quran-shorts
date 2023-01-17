import wawoff2 from "wawoff2";
import fs from "fs/promises";

export async function convert_woff2_tff(n: number, path_split: string[]) {

    const woff2Buffer = await fs.readFile(
      [...path_split, `p${n}.woff2`].join("\\")
    );
    const file_decompressed = Uint8Array.from(
      woff2Buffer
    );
     const test = await wawoff2.decompress(file_decompressed);
     await fs.writeFile([...path_split, `p${n}.ttf`].join("\\"),test);
  
}
