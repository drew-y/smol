import { inspect } from "util";
import { lexer } from "./lexer";
import { smol } from "./example";
import { parser } from "./parser";

const tokens = lexer(smol);
console.log(inspect(tokens, false, 100));
console.log(inspect(parser(tokens), false, 100));
