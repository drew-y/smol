import { AST, Instruction, Mem, FunctionCall, Value, SmolFunction } from "./definitions";
import { inspect } from "util";

const interpretFnCall = (call: FunctionCall, mem: Mem): Value => {
    if (call.function === "=") {
        const identifier = call.args.pop()!;
        if (identifier instanceof Array) throw Error("Syntax error on assignment");
        if (identifier.type !== "identifier") throw new Error("Expected identifier at assignment");
        const existing = mem[identifier.name];
        if (!existing) throw new Error("Var not defined");
        if (existing.memType === "let" && existing.val) {
            throw new Error("Variable already assigned");
        }
        existing.val = interpreter(call.args.pop()!, mem); // TODO ad safety here
        return { val: undefined };
    }

    if (call.function === "<") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;

        return { val: left < right };
    }

    if (call.function === ">") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;
        return { val: left > right };
    }

    if (call.function === "==") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;
        return { val: left === right };
    }

    if (call.function === "+") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;
        return { val: left + right };
    }

    if (call.function === "-") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;
        return { val: left - right };
    }

    if (call.function === "*") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;
        return { val: left * right };
    }

    if (call.function === "/") {
        const left = interpreter(call.args.pop()!, mem)!.val;
        const right = interpreter(call.args.pop()!, mem)!.val;
        return { val: left / right };
    }

    if (call.function === "print") {
        console.log(interpreter(call.args.pop()!, mem)!.val);
        return { val: undefined };
    }

    const variable = mem[call.function];
    if (!variable || !variable.val) throw new Error(`Function ${call.function} is not defined`);
    const fn: SmolFunction = variable.val.val;
    if (fn.type !== "function") throw new Error(`Function ${call.function} is not a function`);
    const args: Mem = {};
    fn.args.forEach((arg, index) => {
        args[arg] = { memType: "let", val: interpreter(call.args[index], mem) };
    });
    return interpreter(fn.body, { ...mem, ...args });
};

export const interpreter = (ast: AST | Instruction, mem: Mem): Value => {
    if (!ast) return { val: undefined };

    if (ast instanceof Array) {
        let val: Value = { val: undefined };
        for (const instr of ast) {
            val = interpreter(instr, mem);
            if (val.isReturn) { return val; }
        }
        return val;
    }

    if (ast.type === "string" || ast.type === "boolean" || ast.type === "number") {
        return { val: ast.value };
    }

    if (ast.type === "function") {
        return { val: ast };
    }

    if (ast.type === "variable-decleration") {
        if (mem[ast.name]) throw new Error(`Variable ${ast.name} is already defined`);
        mem[ast.name] = { memType: ast.varType, val: undefined };
        return { val: undefined };
    }

    if (ast.type === "function-call") {
        const result = interpretFnCall(ast, mem);
        return result;
    }

    if (ast.type === "return") {
        return { isReturn: true, val: interpreter(ast.exp, mem) };
    }

    if (ast.type === "if") {
        const result = interpreter(ast.condition, mem);
        if (result.val) {
            return { val: interpreter(ast.body, mem) };
        }
        return { val: undefined };
    }

    if (ast.type === "identifier") {
        return { val: mem[ast.name].val!.val! }
    }

    throw new Error(`Unkown instruction ${inspect(ast, false, 100)}`);
};
