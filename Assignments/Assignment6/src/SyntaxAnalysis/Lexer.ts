import { Lexer, Rules } from "moo";
import { compileLexer } from "../Library/Parsing";

const lexingRules: Rules = {
  _: { match: /\s+/, lineBreaks: true },
  declare: /declare\b/,
  return_: /return\b/,
  if_: /if\b/,
  else_: /else\b/,
  while_: /while\b/,
  compose: /compose\b/,
  input: /input\b/,
  print: /print\b/,
  type: /(?:num|bool)\b/,
  bool: /(?:true|false)\b/,
  name: /[A-Za-z]\w*\b/,
  float: /(?:(?<!\d\s*)-)?\d+(?:\.\d*)?\b/,
  plus: /\+/,
  dash: /-/,
  times: /\*/,
  divide: /\//,
  exponent: /\^/,
  and: /&&/,
  or: /\|\|/,
  lessThan: /</,
  not: /!/,
  equal: /==/,
  assign: /=/,
  curlyL: /{/,
  curlyR: /}/,
  semicolon: /;/,
  colon: /:/,
  parenL: /\(/,
  parenR: /\)/,
  comma: /,/,
};

export const lexer: Lexer = compileLexer(lexingRules);
