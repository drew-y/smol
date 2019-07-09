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

const parseStatement = (tokens: Token[], terminator?: Token): AST => {
    const output: AST = [];
    const operator: Token[] = [];

    while (tokens.length > 0) {
        const token = tokens[0];

        if (terminator && token.type === terminator.type && token.value === terminator.value) {
            tokens.shift();
            break;
        }

        if (token.type === "number") {
            output.push({ type: "number", value: Number(token.value) });
            tokens.shift();
            continue;
        }

        if (token.type === "string") {
            output.push({ type: "string", value: token.value });
            tokens.shift();
            continue;
        }

        if (token.type === "boolean") {
            output.push({ type: "boolean", value: token.value === "true" });
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

        if (token.type === "left-paren") {
            tokens.shift();
            output.push(parseStatement(tokens));
            continue;
        }

        if (token.type === "right-paren") {
            tokens.shift();
            break;
        }

        if (token.type === "left-curly") {
            tokens.shift();
            output.push(parser(tokens));
            continue;
        }

        if (token.type === "right-curly") {
            tokens.shift();
            break;
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    while (operator.length > 0) {
        output.push({
            type: "function-call",
            function: operator.pop()!.value,
            arguments: [output.pop(), output.pop()]
        });
    }

    return output;
}

export const parser = (tokens: Token[]): AST => {

}
