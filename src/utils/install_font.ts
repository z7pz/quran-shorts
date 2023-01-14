import { exec } from "child_process";

// TODO: install font (tff)
export function install_font(n, path_split) {
  if (process.platform !== "win32") throw Error("why");
  exec(`copy ${[...path_split, `p${n}.ttf`].join("\\")} %windir%Fonts`);
}
