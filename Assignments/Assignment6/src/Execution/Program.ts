import { Value } from "../AST";
import { CallExpr } from "../AST/Expression";
import { Program } from "../Program";
import { DynamicNestedScope } from "../Scope";
import { executeExpr } from "./Expression";

// To execute a program, we call the main function with no arguments.
export function executeProgram(prog: Program): Value {
  // The bottom-most scope on the stack isn't actually used for anything in this
  // interpreter, since the function call below will immediately push a new
  // local scope. If our toy language had global variables, they would go in
  // this bottom-most scope.
  const scope: DynamicNestedScope = [new Map()];

  // Build an AST for a zero-argument call to the function named "main".
  const mainCall: CallExpr = {
    tag: "call",
    functionName: "main",
    arguments: []
  };

  // Execute the AST for the call to the main function.
  return executeExpr(prog, scope, mainCall);
}