import Editly, { Layer } from "editly";
import { Client } from "../src/structures/Client";
import PQueue from "p-queue";
import { get_font } from "../src/utils";
const client = new Client();
(async () => {
  const test = await client.calculate({ surah: 11, offset: 0 });
  //   console.log(await test.getWords())

  const files = await test.download();
  let total_duration = files
    .map((file) => file.duration)
    .reduce((prev, curr) => prev + curr);

  let start = 0;
  // console.log(files)
  // console.log(files.sort((a, b) => a.i - b.i));
  const layers = files
    .sort((a, b) => a.i - b.i)
    .map((file) => {
      return async () => {
        const text = {
          type: "subtitle",
          fontPath: await get_font(file.font),
          text: file.words
          .map((word) => {
            let htmlEntity = word.code;
            let codePoint = htmlEntity.match(/x([\da-fA-F]+)/)![1];
            let hexCode = codePoint.toUpperCase();
            let character = String.fromCharCode(parseInt(hexCode, 16));
            return character;
          })
          .join(" "),
          start,
          stop: start + file.duration,
        } as Layer;
        const voice = {
          type: "detached-audio",
          start,
          stop: start + file.duration,
          path: file.name,
        } as Layer;
        start += file.duration;
        return [text, voice] as Layer[];
      };
    })
    .flatMap((v) => v);
    const lays = (await new PQueue({ concurrency: 1 }).addAll(layers)).flatMap(
      (v) => v
    );
    console.log(lays);
  Editly({
    keepSourceAudio: false,
    outPath: "test.mp4",
    defaults: {
      transition: null,
      // duration: 0,
      // layer: { "fontPath": "./Al-QuranAlKareem.ttf" },
    },
    clips: [
      {
        duration: total_duration,
        layers: [
          ...lays,
        ],
      },
    ],
  });
})();
