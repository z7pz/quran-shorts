import { Options } from ".";
import { IRecitations, ITranslations, ITafsirs } from "./interfaces";

export class GET {
    constructor(public options: Options) {}
    async recitations() {
        return (
            await this.options.api.axios.get<IRecitations>(
                "options/recitations"
            )
        ).data;
    }
    async translations() {
        return (
            await this.options.api.axios.get<ITranslations>(
                "options/translations"
            )
        ).data;
    }
    async tafsirs() {
        return (await this.options.api.axios.get<ITafsirs>("options/tafsirs"))
            .data;
    }
}
