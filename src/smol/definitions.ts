
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
    arguments: string[];
    body: Statement[];
}

export interface FunctionCall extends Statement {
    type: "function-call";
    function: string;
    arguments: any[];
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
    condition: Statement;
    body: Statement[];
}

export interface WhileStatement extends Statement {
    type: "while";
    condition: Statement;
    body: Statement[];
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
    AST
    > { }
