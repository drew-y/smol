import { inspect } from "util";

/*****************************
 * This file parses arithmetic expressions with the shunting yard alg and evaluates the results.
 ****************************/

type Token = {
    type: "number" | "operator" | "open-paren" | "close-paren";
    val: string;
};

interface AST extends Array<Token | AST> { }

const characterize = (str: string): string[] => str.split("");

const lex = (chars: string[]) => {
    const tokens: Token[] = [];
    const isNumChar = (char: string) => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(char);
    const isOperatorChar = (char: string) => ["+", "-", "*", "/", "^"].includes(char);
    const extractNum = (chars: string[]) => {
        let num: string = "";
        while (isNumChar(chars[0])) {
            num += chars.shift();
        }
        return num;
    };

    while (chars.length > 0) {
        const char = chars[0];
        const nextChar = chars[1];

        if (isNumChar(char)) {
            tokens.push({ type: "number", val: extractNum(chars) });
            continue;
        }

        if (char === "-" && isNumChar(nextChar)) {
            chars.shift();
            tokens.push({ type: "number", val: `-${extractNum(chars)}` });
            continue;
        }

        if (isOperatorChar(char)) {
            tokens.push({ type: "operator", val: chars.shift()! });
            continue;
        }

        if (char === "(") {
            tokens.push({ type: "open-paren", val: chars.shift()! });
            continue;
        }

        if (char === ")") {
            tokens.push({ type: "close-paren", val: chars.shift()! });
            continue;
        }

        if (char === " ") {
            chars.shift();
            continue;
        }

        throw new Error(`Unexpected token: ${char}`);
    }

    return tokens;
}

const parse = (tokens: Token[]): AST => {
    const output: AST = [];
    const operator: Token[] = [];
    const operatorPrecidence = (operator: string): number => {
        const precidences: Record<string, number> = {
            "+": 1,
            "-": 1,
            "*": 2,
            "/": 2,
            "^": 3
        }
        return precidences[operator];
    }

    while (tokens.length > 0) {
        const token = tokens[0];
        if (token.type === "number") {
            output.push(tokens.shift()!);
            continue;
        }

        if (token.type === "operator") {
            while (operator.length > 0) {
                const op = operator[operator.length - 1];
                if (operatorPrecidence(op.val) >= operatorPrecidence(token.val)) {
                    output.push([operator.pop()!, output.pop()!, output.pop()!]);
                    continue;
                }
                break;
            }

            operator.push(tokens.shift()!);
            continue;
        }

        if (token.type === "open-paren") {
            tokens.shift();
            output.push(parse(tokens));
            continue;
        }

        if (token.type === "close-paren") {
            tokens.shift();
            break;
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    while (operator.length > 0) {
        output.push([operator.pop()!, output.pop()!, output.pop()!]);
    }

    return output;
}

const interpret = (ast: AST): number => {
    const token = ast.shift()!;

    if (token instanceof Array) {
        return interpret(token);
    }

    if (token.type === "number") {
        return Number(token.val);
    }

    if (token.type === "operator") {
        const left = interpret([ast.pop()!]);
        const right = interpret([ast.pop()!]);
        switch (token.val) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
            case "^":
                return Math.pow(left, right);
            default:
                break;
        }
    }

    return 0;
}

export const evaluate = (expression: string) => {
    const chars = characterize(expression);
    const tokens = lex(chars);
    const ast = parse(tokens);
    return interpret(ast);
}
