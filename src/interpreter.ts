import { AST, Instruction, Mem, FunctionCall, Value, SmolFunction } from "./definitions";
import { inspect } from "util";

const interpretFnCall = (call: FunctionCall, mem: Mem): Value => {
    const arg1 = call.args[call.args.length - 1];
    const arg2 = call.args[call.args.length - 2];

    if (call.function === "=") {
        const identifier = arg1;
        if (identifier instanceof Array) throw Error("Syntax error on assignment");
        if (identifier.type !== "identifier") throw new Error("Expected identifier at assignment");
        const existing = mem[identifier.name];
        if (!existing) throw new Error("Var not defined");
        if (existing.memType === "let" && existing.val) {
            throw new Error("Variable already assigned");
        }
        existing.val = interpreter(arg2, mem);
        return { val: undefined };
    }

    if (call.function === "<") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;

        return { val: left < right };
    }

    if (call.function === "and") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;

        return { val: left && right };
    }

    if (call.function === "or") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;

        return { val: left || right };
    }

    if (call.function === "<=") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;

        return { val: left <= right };
    }

    if (call.function === ">=") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;

        return { val: left >= right };
    }

    if (call.function === "<>") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;

        return { val: left !== right };
    }

    if (call.function === ">") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;
        return { val: left > right };
    }

    if (call.function === "==") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;
        return { val: left === right };
    }

    if (call.function === "+") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;
        return { val: left + right };
    }

    if (call.function === "-") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;
        return { val: left - right };
    }

    if (call.function === "*") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;
        return { val: left * right };
    }

    if (call.function === "/") {
        const left = interpreter(arg1, mem)!.val;
        const right = interpreter(arg2, mem)!.val;
        return { val: left / right };
    }

    if (call.function === "print") {
        console.log(interpreter(arg1, mem)!.val);
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

export const interpreter = (instruction: AST | Instruction, mem: Mem): Value => {
    if (instruction instanceof Array) {
        let val: Value = { val: undefined };
        for (const instr of instruction) {
            val = interpreter(instr, mem);
            if (val.isReturn) { return val; }
        }
        return val;
    }

    if (instruction.type === "string" || instruction.type === "boolean" || instruction.type === "number") {
        return { val: instruction.value };
    }

    if (instruction.type === "function") {
        return { val: instruction };
    }

    if (instruction.type === "variable-decleration") {
        if (mem[instruction.name]) throw new Error(`Variable ${instruction.name} is already defined`);
        mem[instruction.name] = { memType: instruction.varType, val: undefined };
        return { val: undefined };
    }

    if (instruction.type === "function-call") {
        return interpretFnCall(instruction, mem);
    }

    if (instruction.type === "return") {
        return { isReturn: true, val: interpreter(instruction.exp, mem).val };
    }

    if (instruction.type === "if") {
        const result = interpreter(instruction.condition, mem);
        if (result.val) {
            return interpreter(instruction.body, { ...mem });
        }
        return { val: undefined };
    }

    if (instruction.type === "identifier") {
        return { val: mem[instruction.name].val!.val! }
    }

    throw new Error(`Unkown instruction ${inspect(instruction, false, 100)}`);
};
