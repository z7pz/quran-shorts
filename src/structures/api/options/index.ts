import { Api } from "../../api";
import { GET } from "./GET";

export class Options {
	get = new GET(this);
	constructor(public api: Api) {}
}
