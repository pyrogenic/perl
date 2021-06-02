import useStorageState, { StorageState, Stringifiable, TDefaultValue } from "./useStorageState";

export default function useSessionState<T extends Stringifiable>(
    keys: string | [string, ...string[]],
    defaultValue: TDefaultValue<T>): StorageState<T> {
    return useStorageState(window.sessionStorage, keys, defaultValue);
}
