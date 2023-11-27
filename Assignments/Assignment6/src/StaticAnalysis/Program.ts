import { Program } from "../Program";
import { StaticNestedScope, declare, popLocalScope, pushLocalScope } from "../Scope";
import { inferExprType } from "./Expression";
import { typecheckStmt } from "./Statement";
import { StaticTypeError, assertType } from "./TypeAssertions";

// Remember, typechecking analyzes everything in the program **exactly once**.
// This includes function definitions: we check each function definition once,
// and then we do **not** re-check the function definitions when we check
// function calls (in typecheckExpr).
export function typecheckProgram(prog: Program) {
  // The bottom-most scope on the stack isn't actually used for anything in
  // this interpreter, since we push a new local scope below before we check
  // any part of the function definition. If our toy language had global
  // variables, they would go in this bottom-most scope.
  const scope: StaticNestedScope = [new Map()];

  // Loop over each function definition in the program.
  for (const func of prog.values()) {
    // Enter a new local scope to check the function in.
    pushLocalScope(scope);

    // Declare each parameter of the function with its defined type.
    for (const param of func.parameters)
      declare(param.name, param.type, scope);

    // Typecheck each statement in the body of the function. This might declare
    // new variables in the function call's local scope.
    for (const stmt of func.body)
      typecheckStmt(prog, scope, stmt);

    // Check that the return expression has the correct type. This might involve
    // looking up the types of expressions that were declared while executing
    // the function body.
    assertType(func.returnType, inferExprType(prog, scope, func.returnExpr));

    // Exit the function call's local scope.
    popLocalScope(scope);
  }

  // The main function is special: it must exist, and it must not have any
  // parameters. We can easily check these requirements during static analysis.
  const main = prog.get("main");
  if (main == null)
    throw new StaticTypeError("no main function in program");
  if (main.parameters.length != 0)
    throw new StaticTypeError("main function cannot have parameters");
}