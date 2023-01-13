import { Client } from "./structures/Client.js";
import { Api } from "./structures/api";
import Editly from "editly";

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
  //   verses.verses
  // );
  const verses = await client.calculate({
    surah: 2,
    offset: 0,
  });
  let files = await verses.download();
  console.log(files);

  Editly({
    keepSourceAudio: true,
    outPath: "outfile.mp4",
    defaults: {
      transition: null,
      layer: { fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" },
    },
    clips: files.map((file) => {
      return {
        duration: file.duration,
        layers: [{ type: "audio", path: file.name }],
      };
    }),
  });
})();
