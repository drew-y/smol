import { lexer } from "./lexer";
import { smolBasic, smolFib, smolEasyTest } from "./example";
import { parser } from "./parser";
import { interpreter } from "./interpreter";

export const evaluate = (smol: string) => {
    const tokens = lexer(smol);
    const ast = parser(tokens);
    interpreter(ast, {});
};

evaluate(smolFib);
