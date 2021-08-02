import minDiff, { Internals } from "../minDiff";

const {
    sameString,
    simplify,
    solo,
    split,
} = Internals;

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
    test("words", () => {
        expect(solo("words", "")).toEqual("");
        expect(solo("words", "a")).toEqual("a");
        expect(solo("words", " ")).toEqual("");
        expect(solo("words", "apple")).toEqual("apple");
        expect(solo("words", " apple")).toEqual("apple");
        expect(solo("words", "'apple'")).toEqual("apple");
        expect(solo("words", "apple jacks")).toEqual("apple");
        expect(solo("words", "apple-jacks")).toEqual("apple");
        expect(solo("words", "apple; jacks")).toEqual("apple");
    })
    test("exception", () => {
        expect(() => solo("invalid" as unknown as any, "")).toThrowError(/unexpected.*invalid/i);
    })
});

describe("split", () => {
    test("minimize", () => {
        expect(split("minimize", "")).toEqual([]);
        expect(split("minimize", "a")).toEqual(["a"]);
        expect(split("minimize", " ")).toEqual([" "]);
        expect(split("minimize", "apple")).toEqual(["a", "p", "p", "l", "e"]);
    })
    test("literal", () => {
        expect(split("literal", "")).toEqual([""]);
        expect(split("literal", "a")).toEqual(["a"]);
        expect(split("literal", " ")).toEqual([" "]);
        expect(split("literal", "apple")).toEqual(["apple"]);
        expect(split("literal", "apple jacks")).toEqual(["apple jacks"]);
    })
    test("exception", () => {
        expect(() => split("invalid" as unknown as any, "")).toThrowError(/unexpected.*invalid/i);
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
            ["The Nice", "Nickleback"],
            ["Nice", "Nick"]
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
            ["app", "but"]
        ],
        [
            ["Bloodrock", "Bobby Hutcherson", { preA: "Blood, Sweat", postB: "Bobby Hutcherson" }],
            ["Bloodr", "Bo"]
        ],
        [
            ["Boz Scaggs", "Bruce Springsteen", { preA: "Boston", postB: "Bruce Springsteen" }],
            ["Boz", "Br"]
        ],
        [
            ["Boz Scaggs Silk Degrees", "Bruce Springsteen Born To Run", { preA: "Boston Boston", postB: "Bruce Springsteen Born In The U.S.A." }],
            ["Boz", "Br"]
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
        [
            [["words", "Rock"], ["words", "Soul"]],
            ["Rock", "Soul"],
        ],
        [
            [["words", "Rock Soul"], ["words", "Rock"]],
            ["Rock Soul", "Rock"],
        ],
        [
            [["words", "Rock"], ["words", "Rock Pop"]],
            ["Rock", "Rock Pop"],
        ],
        [
            [["words", "Rock Soul"], ["words", "Rock Pop"]],
            ["Rock Soul", "Rock Pop"],
        ],
        [
            [["words", "Rock Soul Disco"], ["words", "Rock Pop"], { preA: "Rock Soul Dance" }],
            ["Rock Soul Disco", "Rock Pop"],
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
