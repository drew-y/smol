
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

export interface VariableDecleration extends Statement {
    type: "variable-decleration";
    name: string;
    varType: "let" | "var";
}

export interface IfStatement extends Statement {
    type: "if";
    condition: AST;
    body: AST;
}

export interface WhileStatement extends Statement {
    type: "while";
    condition: AST;
    body: AST;
}

export interface SmolIdentifier extends Statement {
    type: "identifier";
    name: string;
}

export interface AST extends Array<
    SmolFunction |
    FunctionCall |
    SmolNumber |
    SmolBool |
    SmolString |
    VariableDecleration |
    IfStatement |
    WhileStatement |
    SmolIdentifier |
    AST
    > { }
