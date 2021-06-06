import minDiff from "./minDiff";

describe("minDiff", () => {
    [
        [
            [undefined, undefined],
            [undefined, undefined]
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
            ["apple", "butter", { preA: "Apse", postB: "buttress" }],
            ["app", "butte"]
        ],
        [
            ["apple", "butter", { preA: "Apse", postB: "butter" }],
            ["app", "b"]
        ],
        [
            ["Bloodrock", "Bobby Hutcherson", { preA: "Blood, Sweat", postB: "Bobby Hutcherson" }],
            ["Bloodr", "Bo"]
        ],
    ].forEach(([[a, b, q], [c, d]]) => {
        test(`given ${a} & ${b} & ${q && JSON.stringify(q)}, returns ${c}...${d}`, () => {
            expect(minDiff(a, b, q)).toEqual([c, d]);
        })
    });

    test("real-world examples", () => {
        expect(minDiff("Bobby Hutcherson", "Brian Eno", { preA: "Bobby Hutcherson", postB: "Brian Eno" })).toEqual(["Bo", "Br"]);
        expect(minDiff("Bloodrock", "Bobby Hutcherson", { preA: "Blood, Sweat And Tears", postB: "Bobby Hutcherson" })).toEqual(["Bloodr", "Bo"]);
        expect(minDiff("Art Blakey", "Art Blakey & The Jazz Messengers")).toEqual(["Art Blakey", "Art Blakey &"]);
        expect(minDiff("AIR", "Art Blakey & The Jazz Messengers", { postB: "Art Blakey & The Jazz Messengers" })).toEqual(["AI", "Ar"]);
    })
});
