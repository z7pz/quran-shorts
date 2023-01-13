import { Api } from "./structures/api";

const api = new Api();
(async () => {
  const recitations = await api.options.get.recitations();
  const tafsirs = await api.options.get.tafsirs();
  const translations = await api.options.get.translations();
  const verses = await api.verses.get.verses.get.list({
    surah: 2,
  });

  console.log(
    // recitations.recitations[0],
    // tafsirs.tafsirs[0],
    // translations.translations[0],
    verses.verses.length
  );
})();
