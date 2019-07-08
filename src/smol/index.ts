import { inspect } from "util";
import { lexer } from "./lexer";
import { smol } from "./example";

console.log(inspect(lexer(smol), false, 100));
