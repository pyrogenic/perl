import React from "react";

type Options = {
    wait?: number
    leading?: boolean
}

const DEFAULT_OPTIONS: Required<Options> = {
    leading: false,
    wait: 100,
};

export function useRefWrapper<T>(obj: T) {
    const ref = React.useRef<T>()
    ref.current = obj

    return React.useCallback(() => ref.current, [])
}

export default function useDebounce<TArgs extends any[]>(fn: (...props: TArgs) => void, options?: Options) {
    const debounceRef = React.useRef<{
        callback(): void,
        handle: ReturnType<typeof setTimeout>,
    }>();

    const getFn = useRefWrapper(fn)
    const getLeading = useRefWrapper(options?.leading ?? DEFAULT_OPTIONS.leading);
    const getWait = useRefWrapper(options?.wait ?? DEFAULT_OPTIONS.wait);

    const debouncedFn = React.useCallback((...args: TArgs) => {
        let callback: () => void;
        if (debounceRef.current) {
            clearTimeout(debounceRef.current.handle);
            callback = () => {
                debounceRef.current = undefined;
                getFn()?.(...args);
            };
        } else if (getLeading()) {
            callback = () => {
                debounceRef.current = undefined;
            };
            getFn()?.(...args);
        } else {
            callback = () => {
                debounceRef.current = undefined;
                getFn()?.(...args);
            };
        }
        const handle = setTimeout(callback, getWait());
        debounceRef.current = { callback, handle };
    }, [getFn, getLeading, getWait]);
    const flush = () => debounceRef.current?.callback();
    return [debouncedFn, flush];
}
