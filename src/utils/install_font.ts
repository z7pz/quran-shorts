import { execSync } from "child_process";
import fs from "fs/promises";

function getUserHome() {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

/**
 * install the font into the system
 *
 * windows supported
 * linux not supported yet
 */

export async function install_font(n: number) {
  switch (process.platform) {
    case "win32": {
      function promiseFromChildProcess(child: any) {
        return new Promise(function (resolve, reject) {
          child.addListener("error", reject);
          child.addListener("exit", resolve);
        });
      }

      const files = await fs.readdir(
        getUserHome() + "\\AppData\\Local\\Microsoft\\Windows\\Fonts"
      );

      if (files.includes(`p${n}.ttf`)) {
        return;
      }

      let child = execSync(
        `powershell.exe ./fonts.ps1 src\\tmp\\fonts\\p${n} >> err.out`
      );

      const promise = promiseFromChildProcess(child).then(
        function (result) {
          console.log("promise complete: " + result);
        },
        function (err) {
          console.log("promise rejected: " + err);
        }
      );

      return promise;
    }
    default: {
      throw Error("Your OS is not supported. " + process.platform);
    }
  }
}
