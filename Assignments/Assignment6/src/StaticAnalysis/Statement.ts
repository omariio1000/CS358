import { Stmt } from "../AST";

import {
  StaticNestedScope,
  lookup, pushLocalScope, popLocalScope, declare
} from "../Scope";

import { StaticTypeError, assertType } from "./TypeAssertions";
import { inferExprType, inferValueType } from "./Expression";
import { Program } from "../Program";

export function typecheckStmt(
  prog: Program,
  scope: StaticNestedScope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    // Function call statements are typechecked the same way as function call
    // expressions, we just ignore the return type instead of returning it.
    case "call":
    case "compose":
      inferExprType(prog, scope, stmt);
      break;

    case "varDecl": {
      const initialExprType = inferExprType(prog, scope, stmt.initialExpr);
      declare(stmt.name, initialExprType, scope);
      break;
    }

    case "varUpdate": {
      const varType = lookup(stmt.name, scope);
      const newExprType = inferExprType(prog, scope, stmt.newExpr);
      assertType(varType, newExprType);
      break;
    }

    case "print":
      inferExprType(prog, scope, stmt.printExpr);
      break;

    case "block": {
      pushLocalScope(scope);

      for (const blockStmt of stmt.blockStmts)
        typecheckStmt(prog, scope, blockStmt);

      popLocalScope(scope);

      break;
    }

    case "if": {
      const conditionType = inferExprType(prog, scope, stmt.condition);
      assertType("bool", conditionType);

      pushLocalScope(scope);
      typecheckStmt(prog, scope, stmt.trueBranch);
      popLocalScope(scope);

      if (stmt.falseBranch != null) {
        pushLocalScope(scope);
        typecheckStmt(prog, scope, stmt.falseBranch);
        popLocalScope(scope);
      }

      break;
    }

    case "while": {
      pushLocalScope(scope);

      const conditionType = inferExprType(prog, scope, stmt.condition);
      assertType("bool", conditionType);
      typecheckStmt(prog, scope, stmt.body);

      popLocalScope(scope);

      break;
    }
  }
}
