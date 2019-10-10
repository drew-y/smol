
export type Token = {
    type:
    "operator" | "keyword" | "terminator" | "identifier" | "left-paren" |
    "right-paren" | "pipe" | "left-curly" | "right-curly" | "string" | "number" |
    "comma" | "boolean";
    value: string;
}

export interface Statement {
    type: string;
}

export interface SmolFunction extends Statement {
    type: "function";
    args: string[];
    body: AST;
}

export interface FunctionCall extends Statement {
    type: "function-call";
    function: string;
    args: AST;
}

export interface SmolNumber extends Statement {
    type: "number";
    value: number;
}

export interface SmolString extends Statement {
    type: "string";
    value: string;
}

export interface SmolBool extends Statement {
    type: "boolean";
    value: boolean;
}

export interface VariableDeclaration extends Statement {
    type: "variable-declaration";
    name: string;
    varType: "let" | "var";
}

export interface IfStatement extends Statement {
    type: "if";
    condition: AST | Instruction;
    body: AST | Instruction;
}

export interface ReturnStatement extends Statement {
    type: "return";
    exp: AST | Instruction;
}

export interface BreakStatement extends Statement {
    type: "break";
    exp: AST | Instruction;
}

export interface ContinueStatement extends Statement {
    type: "continue";
}

export interface WhileStatement extends Statement {
    type: "while";
    condition: AST | Instruction;
    body: AST | Instruction;
}

export interface SmolIdentifier extends Statement {
    type: "identifier";
    name: string;
}

export type Instruction =
    SmolFunction |
    FunctionCall |
    SmolNumber |
    SmolBool |
    SmolString |
    VariableDeclaration |
    IfStatement |
    WhileStatement |
    SmolIdentifier |
    BreakStatement |
    ContinueStatement |
    ReturnStatement;

export interface AST extends Array<Instruction | AST> { }

export interface Value {
    isBreak?: boolean;
    isContinue?: boolean;
    isReturn?: boolean;
    val: any;
}

export interface Mem {
    [key: string]: {
        memType: "let" | "var";
        val: Value | undefined;
    }
}
