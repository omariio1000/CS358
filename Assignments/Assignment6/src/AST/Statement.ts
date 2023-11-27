import { Expr, CallExpr, ComposeExpr } from "./Expression";

// Function calls are also valid statements. When a function call is used as a
// statement, its return value just gets ignored.
export type Stmt =
  CallExpr | ComposeExpr |
  VarDeclStmt | VarUpdateStmt | PrintStmt |
  BlockStmt | IfStmt | WhileStmt;


export type VarDeclStmt = {
  readonly tag: "varDecl";
  readonly name: string;
  readonly initialExpr: Expr;
};

export type VarUpdateStmt = {
  readonly tag: "varUpdate";
  readonly name: string;
  readonly newExpr: Expr;
};

export type PrintStmt = {
  readonly tag: "print";
  readonly printExpr: Expr;
};

export type BlockStmt = {
  readonly tag: "block";
  readonly blockStmts: Stmt[];
};

export type IfStmt = {
  readonly tag: "if";
  readonly condition: Expr;
  readonly trueBranch: Stmt;
  readonly falseBranch: Stmt | null;
};

export type WhileStmt = {
  readonly tag: "while";
  readonly condition: Expr;
  readonly body: Stmt;
};