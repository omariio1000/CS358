import * as moo from "moo";

import { Token } from "moo";

import {
  AST,
  InfixOpNode, PrefixOpNode,
  NumLeaf, NameLeaf, BoolLeaf
} from "../AST";

export const compileLexer = (rules: moo.Rules): moo.Lexer => {
  const lexer = moo.compile(rules);
  lexer.next = (next => () => {
    let token: moo.Token | undefined;
    for (
      token = next.call(lexer);
      token && /_+/.test(token.type!);
      token = next.call(lexer)
    );
    return token;
  })(lexer.next);
  return lexer;
}

export const buildInfixOpNode =
  (tag: InfixOpNode["tag"]) =>
  ([leftSubtree, opSymbol, rightSubtree]: [AST, Token, AST]) =>
{
  return { tag, leftSubtree, rightSubtree: rightSubtree };
}

export const buildPrefixOpNode =
  (tag: PrefixOpNode["tag"]) =>
  ([opSymbol, subtree]: [Token, AST]) =>
{
  return { tag, subtree };
}

export function buildBoolLeaf(
  [boolToken]: [Token]
): BoolLeaf {
  return {
    tag: "bool",
    value: boolToken.text == "true"
  };
}

export function buildNumLeaf(
  [numToken]: [Token]
): NumLeaf {
  return {
    tag: "num",
    value: Number.parseFloat(numToken.text)
  };
}

export function buildNameLeaf(
  [nameToken]: [Token]
): NameLeaf {
  return {
    tag: "name",
    name: nameToken.text
  };
}

export function unparenthesize(
  [leftParen, tree, rightParen]: [Token, AST, Token]
): AST {
  return tree;
}