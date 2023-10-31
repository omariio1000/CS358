export type AST = NumLeaf | BoolLeaf | NameLeaf | InfixOpNode | PrefixOpNode;

// An *infix* operator is one that's written **between** two operands.
export type InfixOpNode = {
  tag: "plus" | "minus" | "times" | "divide" | "exponent" | "or" | "and" | "less" | "equal";
  leftSubtree: AST;
  rightSubtree: AST;
}

// A *prefix* operator is one that's written **before** a single operand.
export type PrefixOpNode = {
  tag: "negate" | "not";
  subtree: AST;
}

export type NumLeaf = {
  tag: "num";
  value: number;
}

export type BoolLeaf = {
  tag: "bool";
  value: boolean;
}

export type NameLeaf = {
  tag: "name";
  name: string;
}

export type Value = NumLeaf | BoolLeaf;

export type Scope = Map<string, Value>;

export class ScopeError extends Error { }

export function lookup(name: string, scope: Scope): Value {
  const value = scope.get(name);
  if (value == null)
    throw new ScopeError("name is not in scope: " + name);
  return value;
}