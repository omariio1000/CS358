import { Expr, Stmt } from "./AST";

import { Lexer, Token } from "moo";
import { Grammar, Parser } from "nearley";
import { lexer } from "./SyntaxAnalysis/Lexer";

import { default as grammarRules } from "../gen/SyntaxAnalysis/Program";
import { Program } from "./Program";

const grammar: Grammar = Grammar.fromCompiled(grammarRules);

export function lex(source: string): Token[] {
  lexer.reset(source);
  return Array.from(lexer);
}

export class NoParseError extends Error { }

export function parse(source: string): Program {
  const parses = new Parser(grammar).feed(source).finish();
  if (parses.length < 1)
    throw new NoParseError("invalid expression: " + source);
  return parses[0];
}