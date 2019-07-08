
export type Token = {
    type:
    "operator" | "keyword" | "terminator" | "identifier" | "left-paren" |
    "right-paren" | "pipe" | "left-curly" | "right-curly" | "string" | "number" |
    "comma";
    value: string;
}

export interface Statement {
    type: string;
}

export interface Body extends Statement {
    type: "body";
    statements: Statement[];
}

export interface Function extends Statement {
    type: "function";
    arguments: string[];
    body: Statement[];
}

export interface FunctionCall extends Statement {
    type: "function-call";
    function: string;
    arguments: any[];
}

export interface Value extends Statement {
    type: "value";
    value: any;
}

export interface VariableDecleration extends Statement {
    type: "variable-decleration";
    name: string;
    varType: "let" | "var";
}

export interface IfStatement extends Statement {
    type: "if";
    condition: Statement;
    body: Statement[];
}

export interface WhileStatement extends Statement {
    type: "while";
    condition: Statement;
    body: Statement[];
}

export type AST =
    Body |
    Function |
    FunctionCall |
    Value |
    VariableDecleration |
    IfStatement |
    WhileStatement;
