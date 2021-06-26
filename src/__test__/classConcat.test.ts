import classConcat from "../classConcat";
describe("classConcat", () => {

    test("nothing", () => {
        const classConcated = classConcat();
        expect(classConcated).toBeUndefined();
    });

    test("undefined", () => {
        const classConcated = classConcat(undefined);
        expect(classConcated).toBeUndefined();
    });

    test("false", () => {
        const classConcated = classConcat(false);
        expect(classConcated).toBeUndefined();
    });

    test("null", () => {
        const classConcated = classConcat(null);
        expect(classConcated).toBeUndefined();
    });

    test("[]", () => {
        const classConcated = classConcat([]);
        expect(classConcated).toBeUndefined();
    });

    test("[undefined]", () => {
        const classConcated = classConcat([undefined]);
        expect(classConcated).toBeUndefined();
    });

    test("nested nothing", () => {
        const classConcated = classConcat([[false], [[[null]], undefined]], [undefined], null);
        expect(classConcated).toBeUndefined();
    });

    test("something", () => {
        const foo = "foo";
        // NB: this is also a check that the ReturnType of this invocation does not include undefined
        let classConcated: string = classConcat(foo);
        expect(classConcated).toBe(foo);
        classConcated = classConcat({ className: foo });
        expect(classConcated).toBe(foo);
    });

    test("nested nothings and one something", () => {
        const foo = "foo";
        const classConcated = classConcat([[false], [foo, [[null]], undefined], undefined]);
        expect(classConcated).toBe(foo);
    });

    test("nested nothings and somethings", () => {
        const classConcated = classConcat([[false], ["foo", [[null], "bar"], undefined, "baz"], undefined], "bletch");
        expect(classConcated).toBe("foo bar baz bletch");
    });
});
