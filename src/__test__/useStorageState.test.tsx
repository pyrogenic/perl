import ReactDOM from "react-dom";
import { Test } from "./useStorageState.test.components";
import useStorageState from "../useStorageState";
import { act } from 'react-dom/test-utils';
import React from "react";
describe("useStorageState", () => {
    test("importable", () => {
        expect(useStorageState).toBeDefined();
    });

    const storage: Storage = mockStorage();

    it("renders without crashing", () => {
        const container = document.createElement("div");
        ReactDOM.render(<Test
            kind={storage}
            storageKey={"test"}
            defaultValue={"def"}
            onClickValue={"pressed"}
        />, container);
        let button = container.querySelector("button")!;
        expect(container.textContent).toEqual("Value: def");
        expect(storage.length).toEqual(0);
        click(button);
        expect(storage.length).toEqual(1);
        expect(storage.getItem("test")).toEqual('"pressed"');
        ReactDOM.unmountComponentAtNode(container);

        const q = jest.fn(() => "something new");
        ReactDOM.render(<Test
            kind={storage}
            storageKey={"test"}
            defaultValue={q}
            onClickValue={"something even newer"}
        />, container);
        button = container.querySelector("button")!;
        expect(q).not.toHaveBeenCalled();
        expect(container.textContent).toEqual("Value: pressed");
        ReactDOM.unmountComponentAtNode(container);

        storage.clear();

        ReactDOM.render(<Test
            kind={storage}
            storageKey={"test"}
            defaultValue={q}
            onClickValue={"something even newer"}
        />, container);
        button = container.querySelector("button")!;
        expect(q).toHaveBeenCalledTimes(1);
        expect(container.textContent).toEqual("Value: something new");
        ReactDOM.unmountComponentAtNode(container);
    });

});

function click(button: HTMLButtonElement) {
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
}

function mockStorage(): Storage & { store: Map<string, string> } {
    const store = new Map<string, string>();
    return {
        clear() { store.clear() },
        getItem(key) { return store.get(key) ?? null },
        setItem(a, b) { store.set(a, b) },
        key(n) { return Array.from(store.keys())[n] },
        get length() { return store.size },
        removeItem(a) { store.delete(a) },
        store,
    };
}

