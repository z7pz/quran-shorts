import { exec, execSync } from "child_process";

// TODO: install font (tff)
export function install_font(n, path_split) {
  if (process.platform !== "win32") throw Error("why");
  function promiseFromChildProcess(child) {
    return new Promise(function (resolve, reject) {
      child.addListener("error", reject);
      child.addListener("exit", resolve);
    });
  }

  var child1 = exec(
    `copy ${[...path_split, `p${n}.ttf`].join("\\")} %windir%Fonts`
  );
  var child2 = exec(
    `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /v "p${n}" /t REG_SZ /d ${[...path_split, `p${n}.ttf`].join("\\")} /f`
  );
  const first = promiseFromChildProcess(child1).then(
    function (result) {
      console.log("promise complete: " + result);
    },
    function (err) {
      console.log("promise rejected: " + err);
    }
  );
  const second = promiseFromChildProcess(child2).then(
    function (result) {
      // console.log("promise complete: " + result);
    },
    function (err) {
      // console.log("promise rejected: " + err);
    }
  );

  return 


}
