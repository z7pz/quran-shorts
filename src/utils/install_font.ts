import { execSync } from "child_process";
import fs from "fs/promises";

function getUserHome() {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

function promiseFromChildProcess(child) {
  return new Promise(function (resolve, reject) {
    child.addListener("error", reject);
    child.addListener("exit", resolve);
  });
}

export async function install_font(n, path_split) {
  if (process.platform !== "win32") throw Error("why");

  const files = await fs.readdir(
    getUserHome() + "\\AppData\\Local\\Microsoft\\Windows\\Fonts"
  );

  if (files.includes(`p${n}.ttf`)) {
    return;
  }

  let child1 = execSync(
    `powershell.exe ./fonts.ps1 src\\tmp\\fonts\\p${n} >> err.out`
  );

  const first = promiseFromChildProcess(child1).then(
    function (result) {
      console.log("promise complete: " + result);
    },
    function (err) {
      console.log("promise rejected: " + err);
    }
  );

  return first;
}
