import minDiff, { Internals } from "../minDiff";
const { sameString, simplify, solo } = Internals;
describe("simplify", () => {
    it("removes awkward charaters", () => {
        expect(simplify("")).toEqual("");
        expect(simplify(" ")).toEqual("");
        expect(simplify("apple")).toEqual("apple");
        expect(simplify("Apple")).toEqual("apple");
        expect(simplify("'Apple'")).toEqual("apple");
        expect(simplify(";Any 'ap\"ple; ")).toEqual(";anyapple;");
    })
});

describe("solo", () => {
    test("minimize", () => {
        expect(solo("minimize", "")).toEqual("");
        expect(solo("minimize", "a")).toEqual("a");
        expect(solo("minimize", " ")).toEqual(" ");
        expect(solo("minimize", "apple")).toEqual("a");
    })
    test("literal", () => {
        expect(solo("literal", "")).toEqual("");
        expect(solo("literal", "a")).toEqual("a");
        expect(solo("literal", " ")).toEqual(" ");
        expect(solo("literal", "apple")).toEqual("apple");
    })
    test("exception", () => {
        expect(() => solo("invalid" as unknown as any, "")).toThrowError(/unexpected.*invalid/i);
    })
});

describe("minDiff", () => {
    [
        [
            [undefined, undefined],
            [undefined, undefined]
        ],
        [
            [undefined, "apple"],
            [undefined, "a"]
        ],
        [
            ["apple", undefined],
            ["a", undefined]
        ],
        [
            ["apple", "butter"],
            ["a", "b"]
        ],
        [
            ["Apple", "apple"],
            ["A", "a"]
        ],
        [
            ["'apple'", "butter"],
            ["a", "b"]
        ],
        [
            ["Apple", "aqueous"],
            ["Ap", "aq"]
        ],
        [
            ["Apple", "apoplectic"],
            ["App", "apo"]
        ],
        [
            ["apiary", "apple"],
            ["api", "app"]
        ],
        [
            ["longer", "long"],
            ["longe", "long"]
        ],
        [
            ["apple", undefined, { preA: "Acorn" }],
            ["ap", undefined]
        ],
        [
            ["apple", undefined, { preA: "Apse" }],
            ["app", undefined]
        ],
        [
            ["apple", undefined, { preA: "apple" }],
            ["a", undefined]
        ],
        [
            ["apple", undefined, { preA: "Apple" }],
            ["a", undefined]
        ],
        [
            ["apple", "apps", { preA: "apparatchik" }],
            ["appl", "apps"]
        ],
        [
            ["apple", "butter", { preA: "Apse", postB: "buttress" }],
            ["app", "butte"]
        ],
        [
            ["apple", "butter", { preA: "Apse", postB: "butter" }],
            ["app", "b"]
        ],
        [
            ["apple", "but", { preA: "Apse", postB: "butter" }],
            ["app", "b"]
        ],
        [
            ["Bloodrock", "Bobby Hutcherson", { preA: "Blood, Sweat", postB: "Bobby Hutcherson" }],
            ["Bloodr", "Bo"]
        ],
        [
            [["literal", "apple"], undefined],
            ["apple", undefined],
        ],
        [
            [undefined, ["literal", "apple"]],
            [undefined, "apple"],
        ],
        [
            [undefined, ["literal", "apple"], { postB: "apple" }],
            [undefined, "apple"],
        ],
        [
            [undefined, ["literal", "apple"], { postB: "butter" }],
            [undefined, "apple"],
        ],
        [
            [["literal", "apple"], ["literal", "apple"]],
            ["apple", "apple"],
        ],
    ].forEach(([[a, b, q], [c, d]]: any) => {
        test(`given ${a} & ${b} & ${q && JSON.stringify(q)}, returns ${c}...${d}`, () => {
            expect(minDiff(a, b, q)).toEqual([c, d]);
        })
    });

    test("real-world examples", () => {
        expect(minDiff("Bobby Hutcherson", "Brian Eno", { preA: "Bobby Hutcherson", postB: "Brian Eno" })).toEqual(["Bo", "Br"]);
        expect(minDiff("Bloodrock", "Bobby Hutcherson", { preA: "Blood, Sweat And Tears", postB: "Bobby Hutcherson" })).toEqual(["Bloodr", "Bo"]);
        expect(minDiff("Art Blakey", "Art Blakey & The Jazz Messengers")).toEqual(["Art Blakey", "Art Blakey &"]);
        expect(minDiff("AIR", "Art Blakey & The Jazz Messengers", { postB: "Art Blakey & The Jazz Messengers" })).toEqual(["AI", "Ar"]);
        expect(minDiff(["literal", "4★"], ["literal", "5★"])).toEqual(["4★", "5★"]);
    })
});
