export type ValueType = "num" | "bool";

export type Expr =
  CallExpr | ComposeExpr |
  PlusExpr | MinusExpr | TimesExpr | DivideExpr | ExponentExpr |
  AndExpr | OrExpr | LessThanExpr | EqualExpr |
  NegateExpr | NotExpr | InputExpr |
  NumLeaf | BoolLeaf | VarLeaf;

export type Value = number | boolean;

// This is our AST node type for a function **call** (NOT a function definition).
export type CallExpr = {
  readonly tag: "call";
  readonly functionName: string;
  readonly arguments: Expr[];
}

// This is our AST node type for a composed function call, as explained in exercise 2.
export type ComposeExpr = {
  readonly tag: "compose";
  readonly functionNames: string[];
  readonly arguments: Expr[];
}

export type InputExpr = {
  readonly tag: "input";
  readonly type: ValueType;
}


export type InfixExpr = {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;
}

export type PrefixExpr = {
  readonly subexpr: Expr;
}


export type PlusExpr = { readonly tag: "plus" } & InfixExpr;
export type MinusExpr = { readonly tag: "minus" } & InfixExpr;
export type TimesExpr = { readonly tag: "times" } & InfixExpr;
export type DivideExpr = { readonly tag: "divide" } & InfixExpr;
export type ExponentExpr = { readonly tag: "exponent" } & InfixExpr;
export type AndExpr = { readonly tag: "and" } & InfixExpr;
export type OrExpr = { readonly tag: "or" } & InfixExpr;
export type LessThanExpr = { readonly tag: "lessThan" } & InfixExpr;
export type EqualExpr = { readonly tag: "equal" } & InfixExpr;
export type NegateExpr = { readonly tag: "negate" } & PrefixExpr;
export type NotExpr = { readonly tag: "not" } & PrefixExpr;


export type NumLeaf = {
  readonly tag: "num";
  readonly value: number;
}

export type BoolLeaf = {
  readonly tag: "bool";
  readonly value: boolean;
}

export type VarLeaf = {
  readonly tag: "var";
  readonly name: string;
}