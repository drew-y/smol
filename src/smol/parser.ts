import { Token, AST } from "./definitions";
import { inspect } from "util";

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

const parseFnCall = (tokens: Token[]): AST => {
    const expressions: Token[][] = [];
    let curExpr: Token[] = [];

    let token = tokens.shift()!;
    while (token.type !== "right-paren") {
        if (token.type === "comma") {
            expressions.push(curExpr);
            curExpr = [];
            token = tokens.shift()!;
            continue;
        }

        curExpr.push(token);
        token = tokens.shift()!;
    }
    expressions.push(curExpr);

    const ast: AST = [];
    for (const expr of expressions) {
        ast.push(parseStatement(expr));
    }
    return ast;
}

const parseArgs = (tokens: Token[]): string[] => {
    const args: string[] = [];

    let token = tokens.shift()!;
    while (token.type !== "pipe") {
        if (token.type === "comma") {
            token = tokens.shift()!;
            continue;
        }

        args.push(token.value);
        token = tokens.shift()!;
    }

    return args;
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
                break;
            }

            if (token.value === "var") {
                const next = tokens[1];
                output.push({ type: "variable-decleration", name: next.value, varType: "var" });
                tokens.shift();
                break;
            }

            if (token.value === "if") {
                tokens.shift();
                const condition = parseStatement(tokens, { type: "left-curly", value: "{" });
                const body = parser(tokens);
                output.push({ type: "if", condition, body });
                continue;
            }

            if (token.value === "return") {
                tokens.shift();
                output.push({ type: "return", exp: parseStatement(tokens) });
                continue;
            }

            throw new Error(`Unkown keyword: ${token.value}`);
        }

        if (token.type === "identifier") {
            const next = tokens[1];
            if (next && next.type === "left-paren") {
                tokens.shift();
                tokens.shift();
                output.push({
                    type: "function-call",
                    function: token.value,
                    args: parseFnCall(tokens),
                });
                continue;
            }

            output.push({ type: "identifier", name: token.value });
            tokens.shift();
            continue;
        }

        if (token.type === "operator") {
            while (operator.length > 0) {
                const op = operator[operator.length - 1];
                if (operatorPrecidence(op.value) >= operatorPrecidence(token.value)) {
                    output.push({
                        type: "function-call",
                        function: operator.pop()!.value,
                        args: [output.pop()!, output.pop()!]
                    });
                    continue;
                }
                break;
            }

            operator.push(tokens.shift()!);
            continue;
        }

        if (token.type === "pipe") {
            tokens.shift();
            const args = parseArgs(tokens);
            tokens.shift(); // Get rid of left curly;
            output.push({ type: "function", args, body: parser(tokens) });
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
            break;
        }

        if (token.type === "terminator") {
            tokens.shift();
            break;
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    while (operator.length > 0) {
        output.push({
            type: "function-call",
            function: operator.pop()!.value,
            args: [output.pop()!, output.pop()!]
        });
    }

    return output;
}

export const parser = (tokens: Token[]): AST => {
    const ast: AST = [];

    while (tokens.length > 0) {
        if (tokens[0].type === "right-curly") {
            tokens.shift();
            break;
        }

        ast.push(parseStatement(tokens));
    }

    return ast;
}
