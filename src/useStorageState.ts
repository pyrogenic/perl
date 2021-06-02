import React from "react";
import join from "./join";

type TDefaultValue<T> = Exclude<T extends Function ? T : (T | (() => T)), undefined>;

export type Stringifiable = Parameters<JSON["stringify"]>[0];

export type SetState<T extends Stringifiable> = React.Dispatch<React.SetStateAction<T>>;

type StorageState<T extends Stringifiable> = [state: T, setState: SetState<T>, resetState: () => void];

export default function useStorageState<T extends Stringifiable>(
    storage: Storage | "local" | "session",
    keys: string | [string, ...string[]],
    defaultValue: TDefaultValue<T>): StorageState<T> {
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
    const [state, setState] = React.useState(resultValue as T);
    React.useEffect(effect, [state, storageSet]);
    return [state, setState, resetState];
    function effect() {
        storageSet(JSON.stringify(state));
    }
    function resetState() {
        if (typeof defaultValue === "function") {
            setState(defaultValue());
        } else {
            setState(defaultValue);
        }
    }
}
