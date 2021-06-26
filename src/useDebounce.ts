import React from "react";

type Options = {
    wait?: number,
    periodic?: boolean,
    verbose?: string,
    leading?: boolean,
}

const DEFAULT_OPTIONS: Options = {
    leading: false,
    periodic: false,
    verbose: undefined,
    wait: 100,
};

/** Wrap a prop in a ref to allow construction of memoized callbacks that act on the most recent prop value without having to be recompiled each time the value changes. */
export function useRefWrapper<T>(obj: T) {
    const ref = React.useRef<T>()
    ref.current = obj

    return React.useCallback(() => ref.current, [])
}

export default function useDebounce<TArgs extends any[]>(fn: (...props: TArgs) => void, options?: Options) {
    const debounceRef = React.useRef<{
        args: TArgs | undefined,
        callback(): void,
        handle: ReturnType<typeof setTimeout>,
    }>();

    const getFn = useRefWrapper(fn)
    const getLeading = useRefWrapper(options?.leading ?? DEFAULT_OPTIONS.leading);
    const getPeriodic = useRefWrapper(options?.periodic ?? DEFAULT_OPTIONS.periodic);
    const getVerbose = useRefWrapper(options?.verbose ?? DEFAULT_OPTIONS.verbose);
    const getWait = useRefWrapper(options?.wait ?? DEFAULT_OPTIONS.wait);

    const callback = React.useMemo(() => {
        let verbose = getVerbose();
        if (verbose) {
            console.warn(`[${verbose}] building callback`);
        }
        return () => {
            verbose = getVerbose();
            const currentArgs = debounceRef.current?.args;
            if (verbose) {
                const action = currentArgs === undefined ? "clearing" : `invoking, then deferring further invocations within ${getWait()}ms`;
                console.log(`[${verbose}] ${action}`);
            }
            if (currentArgs !== undefined) {
                getFn()?.(...currentArgs);
                if (debounceRef.current) {
                    const callback = debounceRef.current.callback;
                    const handle = setTimeout(callback, getWait());
                    debounceRef.current = { args: undefined, callback, handle };
                }
            } else {
                debounceRef.current = undefined;
            }
        };
    }, [debounceRef, getFn, getVerbose]);

    const debouncedFn = React.useMemo(() => {
        let verbose = getVerbose();
        if (verbose) {
            console.warn(`[${verbose}] building debouncedFn`);
        }
        return ((...args: TArgs) => {
            verbose = getVerbose();
            const wait = getWait();
            if (debounceRef.current) {
                if (getPeriodic()) {
                    if (verbose) {
                        console.log(`[${verbose}] updating args`);
                    }
                    debounceRef.current.args = args;
                    return;
                } else {
                    if (verbose) {
                        console.log(`[${verbose}] clear timeout, deferring for another ${wait}ms`);
                    }
                    clearTimeout(debounceRef.current.handle);
                    const handle = setTimeout(callback, wait);
                    debounceRef.current = { args, callback, handle };
                    return;
                }
            } else if (getLeading()) {
                if (verbose) {
                    console.log(`[${verbose}] invoking on leading edge, then deferring further invocations within ${wait}ms`);
                }
                getFn()?.(...args);
                const handle = setTimeout(callback, wait);
                debounceRef.current = { args: undefined, callback, handle };
                return;
            } else {
                if (verbose) {
                    console.warn(`[${verbose}] deferring invocation for ${wait}ms`);
                }
                const handle = setTimeout(callback, wait);
                debounceRef.current = { args, callback, handle };
                return;
            }
        });
    }, [getFn, getLeading, getWait, callback]);
    return [debouncedFn, callback];
}
