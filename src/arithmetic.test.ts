import { evaluate } from "./arithmetic";

test("evaluates '4 + (12 - 4) * 2 ^ 3' to 68", () => {
    expect(evaluate("4 + (12 - 4) * 2 ^ 3")).toBe(68);
});

test("evaluates '", () => {
    expect(evaluate("8 - 2 - 2 - -2")).toBe(6);
});

test("evaluates '", () => {
    expect(evaluate("8 + 2 - 2 + -2 + 10 / 2")).toBe(11);
});
