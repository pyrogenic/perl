import join from "../join";
describe("join", () => {

    test("nothing", () => {
        const joined = join(":");
        expect(joined).toBeUndefined();
    });

    test("undefined", () => {
        const joined = join(":", undefined);
        expect(joined).toBeUndefined();
    });

    test("false", () => {
        const joined = join(":", false);
        expect(joined).toBeUndefined();
    });

    test("null", () => {
        const joined = join(":", null);
        expect(joined).toBeUndefined();
    });

    test("[]", () => {
        const joined = join(":", []);
        expect(joined).toBeUndefined();
    });

    test("[undefined]", () => {
        const joined = join(":", [undefined]);
        expect(joined).toBeUndefined();
    });

    test("nested nothing", () => {
        const joined = join(":", [[false], [[[null]], undefined]], [undefined], null);
        expect(joined).toBeUndefined();
    });

    test("something", () => {
        const foo = "foo";
        // NB: this is also a check that the ReturnType of this invocation does not include undefined
        const joined: string = join(":", foo);
        expect(joined).toBe(foo);
    });

    test("nested nothings and one something", () => {
        const foo = "foo";
        const joined = join(":", [[false], [foo, [[null]], undefined], undefined]);
        expect(joined).toBe(foo);
    });

    test("nested nothings and somethings", () => {
        const joined = join(":", [[false], ["foo", [[null], "bar"], undefined, "baz"], undefined], "bletch");
        expect(joined).toBe("foo:bar:baz:bletch");
    });
});
