export type ClassNames = undefined | null | false | string | { className?: string } | ClassNames[];
export type DefiniteClassNames = string | { className: string } | [string | { className: string }, ...ClassNames[]];

function classConcat0(i: number, ...args: [DefiniteClassNames, ...ClassNames[]]): string;
function classConcat0(i: number, ...args: ClassNames[]): string | undefined;
function classConcat0(i: number, ...args: ClassNames[]): string | undefined {
    if (args.length <= i) {
        return undefined;
    }
    let e = args[i];
    if (typeof e === "object") {
        if (Array.isArray(e)) {
            if (e.length) {
                e = classConcat0(0, ...e);
            } else {
                e = undefined;
            }
        } else if (e) {
            e = e.className;
        } else {
            e = undefined;
        }
    } else if (e === false) {
        e = undefined;
    }
    const f = classConcat0(i + 1, ...args);
    if (!e) {
        return f;
    }
    if (!f) {
        return e;
    }
    return e + " " + f;
}

export default function classConcat(...args: [DefiniteClassNames, ...ClassNames[]]): string;
export default function classConcat(...args: ClassNames[]): string | undefined;
export default function classConcat(...args: ClassNames[]): string | undefined {
    return classConcat0(0, ...args);
}
