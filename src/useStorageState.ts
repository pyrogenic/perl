import React from "react";
import join from "./join";

type TDefaultValue<T> = Exclude<T extends Function ? T : (T | (() => T)), undefined>;

type Stringifiable = Parameters<JSON["stringify"]>[0];

export default function useStorageState<T extends Stringifiable>(
    storage: Storage | "local" | "session",
    keys: string | [string, ...string[]],
    defaultValue: TDefaultValue<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
    const key = join(":", keys);
    const [storageSet, storageValue] = React.useMemo(() => {
        if (storage === "local") {
            storage = window.localStorage;
        } else if (storage === "session") {
            storage = window.sessionStorage;
        }
        return [
            storage.setItem.bind(storage, key),
            storage.getItem(key),
        ];
    }, [storage, key]);
    let currentValue: TDefaultValue<T> | undefined;
    let resultValue: TDefaultValue<T>;
    if (storageValue !== null) {
        try {
            currentValue = JSON.parse(storageValue) as TDefaultValue<T> ?? undefined;
        } catch (e) {
            console.error(e);
        }
    }
    if (currentValue === undefined) {
        if (typeof defaultValue === "function") {
            resultValue = defaultValue();
        } else {
            resultValue = defaultValue;
        }
    } else {
        resultValue = currentValue;
    }
    const result = React.useState(resultValue as T);
    const [state] = result;
    React.useEffect(effect, [state, storageSet]);
    return result;
    function effect() {
        storageSet(JSON.stringify(state));
    }
}
