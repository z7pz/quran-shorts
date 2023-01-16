import { Client } from "../src/structures/Client";
import { upload } from "youtube-videos-uploader";
import { executablePath } from "puppeteer";
import { Video } from "youtube-videos-uploader/dist/types";
const client = new Client();
(async () => {
  let surah = 5;
  let offset = 10;
  let create = 3;
  let i = 0;
  while (create > i) {
    const video = await client.build(offset, surah, i);
    const credentials = { email: "", pass: "" };
    const onVideoUploadSuccess = (videoUrl) => {
      console.log(videoUrl);
    };
    const video1 = {
      path: `test${i}.mp4`,
      title: "title 2",
      description: "description 1",
      isNotForKid: false,
      onSuccess: onVideoUploadSuccess,
      skipProcessingWait: true,
    } as Video;

    // upload(credentials, [video1], { executablePath: executablePath() }).then(
    //   console.log
    // );
    surah = video.surah;
    offset = video.offset;
    i++;
  }
})();
