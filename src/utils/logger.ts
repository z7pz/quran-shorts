export class Logger {
	constructor(public active: boolean) {}
	debug(...messages: any[]) {
		if (!this.active) return;
		console.log("[DEBUG]: ", ...messages);
	}
}
