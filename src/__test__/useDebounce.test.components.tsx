import React from "react";
import useDebounce from "../useDebounce";

export function Test<TArgs extends any[]>({
    fn,
    options,
    onClickValue,
}: {
    fn: Parameters<typeof useDebounce>[0],
    options: Parameters<typeof useDebounce>[1],
    onClickValue: TArgs,
}) {
    const [debouncedFn, flush] = useDebounce(fn, options);
    return <>
        <button id="button" onClick={() => debouncedFn(onClickValue)}>Do It</button>
        <button id="flush" onClick={flush}>Flush</button>
    </>;
}
