import { Stmt, Value } from "../AST";
import { printLine } from "../Library/Runtime";

import {
  DynamicNestedScope,
  pushLocalScope, popLocalScope, declare, update
} from "../Scope";

import { executeExpr } from "./Expression";
import { Program } from "../Program";

export function executeStmt(
  prog: Program,
  scope: DynamicNestedScope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    // Function call statements execute the same way as function call
    // expressions, we just ignore the return value instead of returning it.
    case "call":
    case "compose":
      executeExpr(prog, scope, stmt);
      break;

    case "varDecl": {
      const initialValue: Value = executeExpr(prog, scope, stmt.initialExpr);
      declare<Value>(stmt.name, initialValue, scope);
      break;
    }

    case "varUpdate": {
      const initialValue: Value = executeExpr(prog, scope, stmt.newExpr);
      update(stmt.name, initialValue, scope);
      break;
    }

    case "print": {
      const printValue: Value = executeExpr(prog, scope, stmt.printExpr);
      printLine(printValue);
      break;
    }

    case "block": {
      pushLocalScope<Value>(scope);

      for (const blockStmt of stmt.blockStmts)
        executeStmt(prog, scope, blockStmt);

      popLocalScope<Value>(scope);

      break;
    }

    case "if": {
      pushLocalScope<Value>(scope);

      const conditionValue: Value = executeExpr(prog, scope, stmt.condition);
      if (conditionValue)
        executeStmt(prog, scope, stmt.trueBranch);
      else if (stmt.falseBranch != null)
        executeStmt(prog, scope, stmt.falseBranch);

      popLocalScope<Value>(scope);

      break;
    }

    case "while": {
      pushLocalScope<Value>(scope);

      let conditionValue: Value = executeExpr(prog, scope, stmt.condition);
      while (conditionValue) {
        executeStmt(prog, scope, stmt.body);
        conditionValue = executeExpr(prog, scope, stmt.condition);
      }

      popLocalScope<Value>(scope);

      break;
    }
  }
}
