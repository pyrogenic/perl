
import ReactDOM from "react-dom";
import { Test } from "./useDebounce.test.components";
import useDebounce from "../useDebounce";
import { act } from 'react-dom/test-utils';
import React from "react";
describe("useDebounce", () => {
    test("importable", () => {
        expect(useDebounce).toBeDefined();
    });

    it("non-leading", () => {
        const container = document.createElement("div");
        let semaphore: string = "initial";
        const fn = (value: string) => semaphore = value;
        ReactDOM.render(<Test
            fn={fn}
            options={undefined}
            onClickValue={["click"]}
        />, container);
        let [button, flush] = container.querySelectorAll("button")!;
        expect(semaphore).toEqual("initial");
        click(button);
        expect(semaphore).toEqual("initial");
    });

});

function click(button: HTMLButtonElement) {
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
}
