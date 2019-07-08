import { Token, AST } from "./definitions";

const operatorPrecidence = (operator: string): number => {
    const precidences: Record<string, number> = {
        "and": 0,
        "or": 0,
        "xor": 0,
        "==": 0,
        "<": 0,
        ">": 0,
        ">=": 0,
        "<=": 0,
        "<>": 0,
        "?": 0,
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3,
        ".": 4,
        "=": 5,
        "=>": 5
    }
    return precidences[operator];
}

export const parser = (tokens: Token[]) => {
    const output: AST[] = [];
    const operator: Token[] = [];

    while (tokens.length > 0) {
        const token = tokens[0];
        if (token.type === "number") {
            output.push({ type: "value", value: Number(token.value) });
            tokens.shift();
            continue;
        }

        if (token.type === "string") {
            output.push({ type: "value", value: token.value });
            tokens.shift();
            continue;
        }

        if (token.type === "keyword") {
            if (token.value === "let") {
                const next = tokens[1];
                output.push({ type: "variable-decleration", name: next.value, varType: "let" });
                tokens.shift();
                continue;
            }

            if (token.value === "var") {
                const next = tokens[1];
                output.push({ type: "variable-decleration", name: next.value, varType: "var" });
                tokens.shift();
                continue;
            }

            continue;
        }

        if (token.type === "operator") {
            while (operator.length > 0) {
                const op = operator[operator.length - 1];
                if (operatorPrecidence(op.value) >= operatorPrecidence(token.value)) {
                    output.push({
                        type: "function-call",
                        function: operator.pop()!.value,
                        arguments: [output.pop(), output.pop()]
                    });
                    continue;
                }
                break;
            }

            operator.push(tokens.shift()!);
            continue;
        }
    }
}
