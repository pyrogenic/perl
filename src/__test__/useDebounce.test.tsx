
import React from "react";
import ReactDOM from "react-dom";
import { act } from 'react-dom/test-utils';
import useDebounce from "../useDebounce";
import { Test } from "./useDebounce.test.components";

describe("useDebounce", () => {
    test("importable", () => {
        expect(useDebounce).toBeDefined();
    });

    it("non-leading", (cb) => {
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
        setInterval(() => {
            expect(semaphore).toEqual("initial");
            setInterval(() => {
                expect(semaphore).toEqual("click");
                cb();
            }, 100);
        }, 50);
    });


    it("leading", () => {
        const container = document.createElement("div");
        let semaphore: string = "initial";
        const fn = (value: string) => semaphore = value;
        ReactDOM.render(<Test
            fn={fn}
            options={{leading: true}}
            onClickValue={["click"]}
        />, container);
        let [button, flush] = container.querySelectorAll("button")!;
        expect(semaphore).toEqual("initial");
        click(button);
        expect(semaphore).toEqual("click");
    });

});

function click(button: HTMLButtonElement) {
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
}
