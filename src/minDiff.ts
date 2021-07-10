import compact from "lodash/compact";
import zip from "lodash/zip";

export type MinDiffMode = "literal" | "minimize" | "words";

export type MinDiffSrc = string | [mode: MinDiffMode, value: string] | undefined;

export type MinDiffPrePost = {
    preA?: string;
    postB?: string;
} | undefined;

export default function minDiff(
    a: MinDiffSrc,
    b: MinDiffSrc,
    { preA, postB }: MinDiffPrePost = {}): [string | undefined, string | undefined] {
    let aMode: MinDiffMode = "minimize";
    let bMode: MinDiffMode = "minimize";
    if (Array.isArray(a)) {
        [aMode, a] = a;
    }
    if (aMode === "minimize") {
        a = a?.replace(/^\W+/, "");
    }
    if (Array.isArray(b)) {
        [bMode, b] = b;
    }
    if (bMode === "minimize") {
        b = b?.replace(/^\W+/, "");
    }
    if (a === undefined) {
        if (b === undefined) {
            return [undefined, undefined];
        }
        if (postB !== undefined && !sameString(postB, b)) {
            const [br,] = minDiff([bMode, b], postB);
            return [undefined, br];
        }
        return [undefined, solo(bMode, b)];
    } else if (b === undefined) {
        if (preA !== undefined && !sameString(preA, a)) {
            const [, ar] = minDiff(preA, [aMode, a]);
            return [ar, undefined];
        }
        return [solo(aMode, a), undefined];
    }
    let aa = "";
    let bb = "";
    if (sameString(a, b)) {
        aa = solo(aMode, a);
        bb = solo(bMode, b);
    } else {
        const zipped = zip(split(aMode, a), split(bMode, b));
        for (const [ca, cb] of zipped) {
            if (ca) {
                if (aa && aMode === "words") { aa += " "; }
                aa += ca;
            }
            if (cb) {
                if (bb && bMode === "words") { bb += " "; }
                bb += cb;
            }
            if (ca !== cb && !sameString(ca, cb)) {
                break;
            }
        }
    }
    if (aMode === "literal") {
        aa = a;
    } else if (preA && !sameString(preA, a)) {
        const [, pa] = minDiff([aMode, preA], [aMode, a]);
        if (pa && pa.length > aa.length) {
            aa = pa;
        }
    }
    if (bMode === "literal") {
        bb = b;
    } else if (postB && !sameString(postB, b)) {
        const [pb,] = minDiff([bMode, b], [bMode, postB]);
        if (pb && pb.length > bb.length) {
            bb = pb;
        }
    }
    return [aa, bb];
}

function solo(mode: MinDiffMode, str: string): string {
    switch (mode) {
        case "literal":
            return str;
        case "minimize":
            return str[0] ?? "";
        case "words":
            return split(mode, str)[0] ?? "";
        default:
            throw new Error(`Unexpected mode: ${mode}`);
    }
}

function split(mode: MinDiffMode, str: string): string[] {
    switch (mode) {
        case "literal":
            return [str];
        case "minimize":
            return str.split("");
        case "words":
            return compact(str.split(/\s+/));
        default:
            throw new Error(`Unexpected mode: ${mode}`);
    }
}

function simplify(ca: string | undefined) {
    return ca?.toLocaleLowerCase().replace(/\s|['"]/g, "");
}

function sameString(a: string | undefined, b: string | undefined) {
    a = simplify(a);
    b = simplify(b);
    if (!a) {
        if (!b) {
            return true;
        }
        return false;
    }
    if (!b) {
        return false;
    }
    return a.localeCompare(b) === 0;
}

export const Internals = {
    sameString,
    simplify,
    solo,
    split,
}
