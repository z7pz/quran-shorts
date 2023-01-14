import { Client } from "./structures/Client";
import { Api } from "./structures/api";
import Editly, { Layer } from "editly";

const api = new Api();
const client = new Client();
(async () => {
  // const recitations = await api.options.get.recitations();
  // const tafsirs = await api.options.get.tafsirs();
  // const translations = await api.options.get.translations();
  // const verses = await api.verses.get.verses.get.list({
  //   surah: 2,
  // });
  // console.log(
  //   // recitations.recitations[0],
  //   // tafsirs.tafsirs[0],
  //   // translations.translations[0],
  // verses.verses[0].
  // );
  const verses = await client.calculate({
    surah: 2,
    offset: 20,
  });
  let files = await verses.download();
  let start = 0;
  let dont = false;
  let duration = files
    .map((file) => file.duration)
    .reduce((prev, curr) => prev + curr);
  if (duration + verses.verses.length * 0.4 > 60) {
    console.log(dont);
    dont = true;
  }
  let total_duration = dont ? duration : duration + verses.verses.length * 0.4;
  let f = files
    .map((file) => {
      let res = [
        {
          type: "image-overlay",
          path: file.text,
          start: start,
          stop: start + file.duration + (dont ? 0 : 0.4),
        },
        {
          type: "detached-audio",
          path: file.name,
          start: start,
          stop: start + file.duration,
        },
      ] as Layer[];
      start += file.duration + (dont ? 0 : 0.4);
      return res;
    })
    .flatMap((v) => v);
  Editly({
    keepSourceAudio: false,
    outPath: "outfile.mp4",
    defaults: {
      transition: null,
      // duration: 0,
      // layer: { "fontPath": "./Al-QuranAlKareem.ttf" },
    },
    clips: [
      {
        duration: total_duration,
        layers: [
          {
            type: "linear-gradient",
            colors: ["#fff", "#333"],
          },
          ...f,
        ],
      },
    ],
  });
})();
