// This is the code that defines how *tokenizing* works in the language that
// we're building. You won't need to modify this code, but understanding its
// basic structure will help in understanding the overall phase structure of the
// interpreter we're building.

// The tokenizer generator library we're using is called Moo. Here we import the
// Token type, which is the type of each token that we get back as the output of
// the tokenizing process.
import { Token } from "moo";

// This is a helper function to compile our token sort definitions into a usable
// tokenizer object.
import { compileLexer } from "../Library/Parsing";

// Each line in this definition specifies a *token sort* using a *regular
// expression*. The first line is special: it specifies which characters to
// **skip** during tokenizing, which is how we usually handle things like
// whitespace and comments.
const tokenSorts = {
  _: /[ \t]+/,
  float: /\d+(?:\.\d*)?/,
  bool: /true|false/,
  name: /[A-Za-z]\w*/,
  and: /\&\&/,
  or: /\|\|/,
  not: /!/,
  equal: /==/,
  less: /</,
  plus: /\+/,
  times: /\*/,
  divide: /\//,
  exponent: /\^/,
  dash: /-/,
  parenL: /\(/,
  parenR: /\)/,
  comma: /,/,
};

// This is our generated tokenizer: the compileLexer function builds an object
// that we can use to do the actual tokenization work. (Remember that *lexer* is
// a synonym for *tokenizer*.)
export const tokenizer = compileLexer(tokenSorts);

// The tokenizer object defined above is used with the @lexer directive in
// Expression.ne to tell Nearley what our tokenizing rules are. Nearley then
// automatically tokenizes with these rules when we ask it to parse a string.

// This is a function for tokenizing a string into an array of tokens. This is
// actually only used to produce the tokenizing output on the webpage; Nearley
// uses the tokenizer object directly instead of calling this function.
export function tokenize(source: string): Token[] {
  // The .reset method loads an input string into the lexer for processing. The
  // tokenizer object is *reusable*: even if we've already tokenized some input
  // with it, calling .reset will restore it to its initial state, ready to
  // tokenize some other new input.
  tokenizer.reset(source);

  // This call runs the tokenizer to generate the array of tokens as output.
  return Array.from(tokenizer);
}