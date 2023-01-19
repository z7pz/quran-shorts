import { execSync } from "child_process";
import fs, { copyFile, readdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
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
		case "linux": {
			const fontsDirPath = join(getUserHome(), "/.local/share/fonts");
			try {
				await readdir(fontsDirPath);
			} catch (error) {
				if (error.code == "ENOENT") {
					await fs.mkdir(fontsDirPath);
				} else {
					throw error;
				}
			}
			await copyFile(
				join(__dirname, "..", "tmp", "fonts", `p${n}.ttf`),
				join(fontsDirPath, `p${n}.ttf`)
			);
			return;
		}
		default: {
			throw Error("Your OS is not supported. " + process.platform);
		}
	}
}
