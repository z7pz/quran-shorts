import Editly, { Layer } from "editly";
import { Client } from "../src/structures/Client";
import PQueue from "p-queue";
import { get_font } from "../src/utils";
const client = new Client();
(async () => {
  await client.build();
})();
