import { Token } from "moo";

import {
  ValueType, Expr, Stmt,
  InfixExpr, PrefixExpr, BoolLeaf, NumLeaf,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, LessThanExpr, EqualExpr,
  NegateExpr, NotExpr,
  InputExpr,
  VarLeaf,
  VarDeclStmt, VarUpdateStmt, PrintStmt,
  BlockStmt, IfStmt, WhileStmt, Func
} from "../AST";

import { postprocessWithTag } from "../Library/Parsing";
import { Program } from "../Program";
import { NoParseError } from "../SyntaxAnalysis";
import { CallExpr, ComposeExpr } from "../AST/Expression";

function buildInfixExpr(
  leftExpr: Expr,
  operator: Token,
  rightExpr: Expr
): InfixExpr {
  return {
    leftSubexpr: leftExpr,
    rightSubexpr: rightExpr
  };
}

function buildPrefixExpr(
  operator: Token,
  expr: Expr
): PrefixExpr {
  return { subexpr: expr };
}

type InfixBuilder<TreeType> = (args: [Expr, Token, Expr]) => TreeType;
type PrefixBuilder<TreeType> = (args: [Token, Expr]) => TreeType;

export const buildPlusExpr: InfixBuilder<PlusExpr> =
  postprocessWithTag("plus", buildInfixExpr);

export const buildMinusExpr: InfixBuilder<MinusExpr> =
  postprocessWithTag("minus", buildInfixExpr);

export const buildTimesExpr: InfixBuilder<TimesExpr> =
  postprocessWithTag("times", buildInfixExpr);

export const buildDivideExpr: InfixBuilder<DivideExpr> =
  postprocessWithTag("divide", buildInfixExpr);

export const buildExponentExpr: InfixBuilder<ExponentExpr> =
  postprocessWithTag("exponent", buildInfixExpr);

export const buildAndExpr: InfixBuilder<AndExpr> =
  postprocessWithTag("and", buildInfixExpr);

export const buildOrExpr: InfixBuilder<OrExpr> =
  postprocessWithTag("or", buildInfixExpr);

export const buildLessThanExpr: InfixBuilder<LessThanExpr> =
  postprocessWithTag("lessThan", buildInfixExpr);

export const buildEqualExpr: InfixBuilder<EqualExpr> =
  postprocessWithTag("equal", buildInfixExpr);

export const buildNegateExpr: PrefixBuilder<NegateExpr> =
  postprocessWithTag("negate", buildPrefixExpr);

export const buildNotExpr: PrefixBuilder<NotExpr> =
  postprocessWithTag("not", buildPrefixExpr);

export function buildCallExpr(
  name: Token,
  parenL: Token,
  args: Expr[],
  parenR: Token,
): CallExpr {
  return {
    tag: "call",
    functionName: name.text,
    arguments: args
  }
}

export function buildComposeExpr(
  compose: Token,
  parenL: Token,
  names: string[],
  parenR: Token,
  parenL_: Token,
  args: Expr[],
  parenR_: Token,
): ComposeExpr {
  return {
    tag: "compose",
    functionNames: names,
    arguments: args
  }
}

export function buildInputExpr(
  input: Token,
  angleLeft: Token,
  type: Token,
  angleRight: Token
): InputExpr {
  return {
    tag: "input",
    type: <ValueType> type.text
  }
}

export function buildNumLeaf(
  numToken: Token
): NumLeaf {
  return {
    tag: "num",
    value: Number.parseFloat(numToken.text)
  };
}

export function buildBoolLeaf(
  boolToken: Token
): BoolLeaf {
  return {
    tag: "bool",
    value: boolToken.text == "true"
  };
}

export function buildVarLeaf(
  nameToken: Token
): VarLeaf {
  return {
    tag: "var",
    name: nameToken.text
  };
}

export function unparenthesize(
  leftParen: Token,
  tree: Expr,
  rightParen: Token
): Expr {
  return tree;
}

export function buildCommandStmt(
  stmt: Stmt,
  semicolon: Token
): Stmt {
  return stmt;
}

export function buildVarDeclStmt(
  let_: Token,
  varName: Token,
  equal: Token,
  expr: Expr,
): VarDeclStmt {
  return {
    tag: "varDecl",
    name: varName.text,
    initialExpr: expr
  }
}

export function buildVarUpdateStmt(
  varName: Token,
  equal: Token,
  expr: Expr,
): VarUpdateStmt {
  return {
    tag: "varUpdate",
    name: varName.text,
    newExpr: expr
  }
}

export function buildPrintStmt(
  print: Token,
  expr: Expr,
): PrintStmt {
  return {
    tag: "print",
    printExpr: expr
  }
}

export function buildBlockStmt(
  curlyL: Token,
  stmts: Stmt[],
  curlyR: Token
): BlockStmt {
  return {
    tag: "block",
    blockStmts: stmts
  }
}

export function buildIfStmt(
  if_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  trueBranch: Stmt,
  else_: [Token, Stmt] | null
): IfStmt {
  return {
    tag: "if",
    condition: condition,
    trueBranch: trueBranch,
    falseBranch: else_ == null ? null : else_[1]
  }
}

export function buildWhileStmt(
  while_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  body: Stmt
): WhileStmt {
  return {
    tag: "while",
    condition: condition,
    body: body
  }
}

export function buildFunc(
  returnType: Token,
  name: Token,
  parenL: Token,
  params: [ValueType, string][],
  parenR: Token,
  curlyL: Token,
  body: Stmt[],
  return_: Token,
  returnExpr: Expr,
  curlyR: Token,
): [string, Func] {
  return [name.text, {
    parameters: params.map(([type, name]) => { return { type, name } }),
    returnType: returnType.text as ValueType,
    body,
    returnExpr
  }]
}

export function buildProgram(
  funcDefs: [string, Func][],
): Program {
  const prog = new Map();
  for (const [name, func] of funcDefs)
    if (prog.has(name))
      throw new NoParseError("duplicate function definition for name " + name);
    else
      prog.set(name, func);
  return prog as Program;
}

export function buildEmptyList<T>(
): T[] {
  return [];
}

export function buildSingletonParamList(
  type: Token,
  name: Token,
): [ValueType, string][] {
  return [[type.text as ValueType, name.text]];
}

export function buildMultiParamList(
  type: Token,
  name: Token,
  comma: Token,
  rest: [ValueType, string][],
): [ValueType, string][] {
  return [[type.text as ValueType, name.text], ...rest];
}

export function buildSingletonArgList(
  expr: Expr,
): Expr[] {
  return [expr];
}

export function buildMultiArgList(
  expr: Expr,
  comma: Token,
  rest: Expr[],
): Expr[] {
  return [expr, ...rest];
}

export function buildSingletonNameList(
  name: Token,
): string[] {
  return [name.text];
}

export function buildMultiNameList(
  name: Token,
  comma: Token,
  rest: string[],
): string[] {
  return [name.text, ...rest];
}