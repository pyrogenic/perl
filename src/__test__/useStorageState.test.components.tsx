import React from "react";
import useStorageState from "../useStorageState";

export function Test<T>({
    kind,
    storageKey,
    defaultValue,
    onClickValue,
}: {
    kind: Parameters<typeof useStorageState>[0],
    storageKey: Parameters<typeof useStorageState>[1],
    defaultValue: (T | (() => T)),
    onClickValue: T,
}) {
    const [state, setState] = useStorageState<T>(kind, storageKey, defaultValue as any);
    return <button id="button" onClick={() => setState(onClickValue)}>Value: {state}</button>;
}
