import axios from "axios";
import { Options } from "./options";
import { Verses } from "./verses";

export class Api {
	axios = axios.create({
		baseURL: "http://api.quran.com/api/v3/",
	});
	options = new Options(this);
	verses = new Verses(this);
}
