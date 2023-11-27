import { Expr, ValueType } from "./Expression";
import { Stmt } from "./Statement";

// This is our AST node type for a function parameter.
export type Param = {
  readonly type: ValueType;
  readonly name: string;
}

// This is our AST node type for a function **definition** (NOT a function call).
export type Func = {
  readonly parameters: Param[];
  readonly returnType: ValueType;
  readonly body: Stmt[];
  readonly returnExpr: Expr;
}