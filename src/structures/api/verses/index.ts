import { Api } from "..";
import { GET } from "./GET";

export class Verses {
  get = new GET(this);
  constructor(public api: Api) {}
}
