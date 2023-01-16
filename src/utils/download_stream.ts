import axios from "axios";
import { createWriteStream } from "fs";

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
        });
      });
    });
  }