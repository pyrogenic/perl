import compact from "lodash/compact";
import flattenDeep from "lodash/flattenDeep";

export type Strings = undefined | null | false | string | Strings[];
export type DefiniteStrings = string | [string, ...Strings[]];

export default function join(sep: string, ...args: [DefiniteStrings, ...Strings[]]): string;
export default function join(sep: string, ...args: Strings[]): string | undefined;
export default function join(sep: string, ...args: Strings[]): string | undefined {
    const f = compact(flattenDeep(args));
    switch (f.length) {
        case 0:
            return undefined;
        case 1:
            return f[0];
        default:
            return f.join(sep);
    }
}
