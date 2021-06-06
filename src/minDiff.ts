import zip from "lodash/zip";

export default function minDiff(
    a: string | undefined,
    b: string | undefined,
    { preA, postB }: {
        preA?: string,
        postB?: string
    } = {}): [string | undefined, string | undefined] {
    a = a?.replace(/^\W+/, "");
    b = b?.replace(/^\W+/, "");
    if (a === undefined) {
        if (b === undefined) {
            return [undefined, undefined];
        }
        if (postB !== undefined && !sameString(postB, b)) {
            const [br,] = minDiff(b, postB);
            return [undefined, br];
        }
        return [undefined, b[0]];
    } else if (b === undefined) {
        if (preA !== undefined && !sameString(preA, a)) {
            const [, ar] = minDiff(preA, a);
            return [ar, undefined];
        }
        return [a[0], undefined];
    }
    let aa = "";
    let bb = "";
    if (sameString(a, b)) {
        aa = a[0];
        bb = b[0];
    } else {
        const zipped = zip(a.split(""), b.split(""));
        for (const [ca, cb] of zipped) {
            if (ca) { aa += ca; }
            if (cb) { bb += cb; }
            if (ca !== cb && !sameString(ca, cb)) {
                break;
            }
        }
    }
    if (preA && !sameString(preA, a)) {
        const [, pa] = minDiff(preA, a);
        if (pa && pa.length > aa.length) {
            aa = pa;
        }
    }
    if (postB && !sameString(postB, b)) {
        const [pb,] = minDiff(b, postB);
        if (pb && pb.length > aa.length) {
            bb = pb;
        }
    }
    return [aa, bb];
}
function simplify(ca: string | undefined) {
    return ca?.toLocaleLowerCase().replace(/\s|['"]/, "");
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

