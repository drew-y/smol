import { inspect } from "util";

const smol = `
    let count = 10

    let fib = |n| {
        if n < 1 return 0
        if n == 1 return 1
        fib(n - 1) + fib(n - 1)
    }

    let result = fib(count)
    print("The result is:")
    print(result)
`;

type Token = {
    type:
    "operator" | "keyword" | "terminator" | "identifier" | "left-paren" |
    "right-paren" | "pipe" | "left-curly" | "right-curly" | "string" | "number" |
    "comma";
    value: string;
}

const lexer = (code: string) => {
    const operators = [
        "+", "-", "*", "/", "=", "==", "and", "or", "xor", "<", ">", ">=", "<=", "<>",
        "=>", ".", "?"
    ];
    const keywords = ["let", "var", "for", "in", "return", "break", "continue", "if", "else", "elif"];
    const terminators = ["\n", ";"];
    const isLetter = (char: string) => (/[a-zA-Z]|_/g).test(char);
    const isNum = (char: string) => (/[0-9]/g).test(char);
    const isOperator = (str: string) => operators.includes(str);
    const isKeyword = (str: string) => keywords.includes(str);
    const isTerminator = (char: string) => terminators.includes(char);
    const extractWord = (chars: string[]) => {
        let word = "";
        while (isLetter(chars[0]) || isNum(chars[0])) {
            word += chars.shift();
        }
        return word;
    };
    const extractNum = (chars: string[]) => {
        let hasHadDot = false;
        let num = "";
        while (chars.length > 0) {
            const next = chars[0];
            if (next === "." && hasHadDot) break;

            if (next === ".") {
                hasHadDot = true;
                num += chars.shift();
                continue;
            }

            if (isNum(next)) {
                num += chars.shift();
                continue;
            }

            break;
        }
        return num;
    };
    const extractString = (chars: string[]) => {
        let string = "";
        while (chars.length > 0) {
            const char = chars.shift();
            if (char === "\"") break;
            string += char;
        }
        return string;
    }
    const extractOperator = (chars: string[]) => {
        let op = "";
        while (isOperator(chars[0])) {
            op += chars.shift();
        }
        return op;
    }

    const chars = code.split("");

    const tokens: Token[] = [];
    while (chars.length > 0) {
        const char = chars.shift()!;
        const next = chars[0];

        if (isTerminator(char)) {
            tokens.push({ type: "terminator", value: char });
            continue;
        }

        if (isLetter(char)) {
            const word = `${char}${extractWord(chars)}`;
            if (isKeyword(word)) {
                tokens.push({ type: "keyword", value: word });
                continue;
            }

            if (isOperator(word)) {
                tokens.push({ type: "operator", value: word });
                continue;
            }

            tokens.push({ type: "identifier", value: word });
            continue;
        }

        if (char === "-" && isNum(next)) {
            tokens.push({ type: "number", value: `-${extractNum(chars)}` });
            continue;
        }

        if (isNum(char)) {
            tokens.push({ type: "number", value: `${char}${extractNum(chars)}` });
            continue;
        }

        if (char === "\"") {
            tokens.push({ type: "string", value: `${char}${extractString(chars)}` });
            continue;
        }

        if (char === "|") {
            tokens.push({ type: "pipe", value: "|" });
            continue;
        }

        if (char === "{") {
            tokens.push({ type: "left-curly", value: "{" });
            continue;
        }

        if (char === "}") {
            tokens.push({ type: "right-curly", value: "}" });
            continue;
        }

        if (char === "(") {
            tokens.push({ type: "left-paren", value: "(" });
            continue;
        }

        if (char === ")") {
            tokens.push({ type: "right-paren", value: ")" });
            continue;
        }

        if (isOperator(char)) {
            const fullOp = `${char}${extractOperator(chars)}`;
            if (!isOperator(fullOp)) {
                throw new Error(`Unkown operator: ${fullOp}`);
            }
            tokens.push({ type: "operator", value: fullOp });
            continue;
        }

        if (char === ",") {
            tokens.push({ type: "comma", value: "," });
            continue;
        }

        if (char === " " || char === "\t" || char === "\r") continue;

        throw new Error(`Unexpected token: ${char}`);
    }
    return tokens;
}

console.log(inspect(lexer(smol), false, 200));
