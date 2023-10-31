// To keep our project reasonably organized, the AST type definitions have been
// split out into their own file, src/AST.ts. You won't have to modify AST.ts,
// but you should read through it to make sure you understand how the AST node
// types are defined this time.
import { AST, Value, Scope, lookup } from "./AST";

// The parser generator library we'll be working with is called Nearley. Here we
// import two types that are both used in compiling Nearley source code to a
// usable TypeScript parser object.
import { Grammar, Parser } from "nearley";

// This file is **automatically generated** by Nearley during the build process
// for this project. The code in the gen folder should not be edited by hand,
// because any manual changes will be replaced on the next build.
import { default as expressionCFG } from "../gen/Grammar/Expression";

// The actual hand-editable CFG rules are in src/Grammar/Expression.ne, which is
// source code in the language of Nearley. In the build process, Expression.ne
// gets *compiled* to TypeScript source code in the gen folder, which then gets
// compiled to JavaScript source code in the build folder.

// The *tokenizing* rules for this language are defined in src/Tokenizer.ts. You
// will not need to edit these rules, but you should read through the file once
// to understand how it relates to the rest of the code.

// The *execution* code has moved over to src/Execution.ts. You also won't need
// to edit this code, but we'll be coming back to the execution phase in
// upcoming assignments, so it's a good idea to make sure you understand the
// execution code we've seen so far.


// This is our function for parsing an input string using a given context-free
// grammar. This is called by the provided library code to generate the ASTs
// that are displayed on the webpage.
export function parse(source: string): AST[] {
  // The Grammar.fromCompiled function turns our CFG into a Grammar object.
  // The Parser constructor takes that Grammar and returns a Parser; then we
  // use .feed to pass our source text into the parser we just constructed;
  // then finally we use .finish to get our array of output ASTs. The Parser
  // class is designed so that an individual parser is **not** reusable: we
  // need to construct a new parser for each input string we want to parse.
  return new Parser(Grammar.fromCompiled(expressionCFG)).feed(source).finish();
}


// For studying parsers, it's very helpful to have a function that returns every
// possible AST, as our parse function does in this assignment. If your grammar
// is ambiguous, the output of the parse function on the webpage can help you
// figure out how to resolve the ambiguity.

// As we've discussed in lecture, while an ambiguous CFG is still a valid CFG in
// a theoretical sense, an ambiguous parser is a buggy parser when implementing
// a programming language. We need a single **unique** AST to pass on to the
// next phases in the interpreter.

// For this reason, most real-world programming language parsers output a single
// AST instead of an array or list of ASTs. The parsing code in this assignment
// is relatively realistic and runs pretty fast, but a real-world parser would
// usually be a bit more optimized by avoiding the extra data structure and
// failing earlier when the input is invalid.


// ********************
// * EXERCISE 1 START *
// ********************

// Open src/Grammar/Expression.ne. This is a Nearley file, which defines a
// *context-free grammar* and *postprocessing rules* for each *production* in
// the grammar.

// This CFG is currently buggy: it does not implement the intended order of
// operations correctly. This is the **intended** order of operations, in the
// fixity table notation from assignment 3:

// ==    1 left
// <     2 right
// ||    3 left
// &&    4 left
// +     5 left
// -     5 left
// *     6 right
// /     6 right

// The prefix operators are also **intended** to be higher precedence than all
// infix operators. For example:

//   "!x / y" should parse the same as "(!x) / y", not "!(x / y)"
//   "-x / y" should parse the same as "(-x) / y", not "-(x / y)"

// Find and fix the bugs in the Expression.ne file so that it correctly
// implements the intended order of operations. There are bugs involving
// **five** infix operator rules. The prefix operator rules should not need to
// be changed in order to fix the bugs. Once you've found and fixed five broken
// infix operator rules, the grammar should work as intended.

// To check how the intended order of operations should work, you can use the
// webpage from assignment 3. This is also a good way to test your solution to
// this assignment: for inputs without prefix operators, your solution should
// behave the same as the assignment 3 parser with this fixity table.

// ******************
// * EXERCISE 1 END *
// ******************