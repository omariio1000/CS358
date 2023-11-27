import { Value } from "./AST";
import { parse } from "./SyntaxAnalysis";
import { executeProgram } from "./Execution/Program";
import { typecheckProgram } from "./StaticAnalysis/Program";
import { clearOutput } from "./Library/Runtime";


// This is the top-level function that "drives" the interpreter. You should be
// able to understand how each of the three main phases is implemented: spend
// some time looking through the code and stepping through it in the debugger!
export function interpret(source: string): Value {
  clearOutput();
  const prog = parse(source);
  typecheckProgram(prog);
  return executeProgram(prog);
}


// ********************
// * EXERCISE 1 START *
// ********************

// Like in assignment 5, the structure of our Scope type in this codebase allows
// *variable shadowing*: two variables in the same NestedScope can have the same
// name as long as they are not defined in the same *local* scope.

// For example, this code is legal (run it to see what the result is):

/*
num main() {
	declare x = false;
	{
		declare x = 100;
		print x;
	}
	print x;
	return 0;
}
*/

// Notice that the code above becomes **ill-typed** if you remove the second
// "declare" keyword: the outer declaration of x has type bool, so it is illegal
// to assign 100 to it. Try it in the interpreter!

// The inner declaration is creating a **new** variable, which goes out of scope
// at the end of the inner block. You can see both variables coming in and out
// of scope if you step through the interpreter while running this program.

// It's very common for modern programming languages to support some form of
// variable shadowing, but the details vary between different languages.

// Currently, the interpreter for our toy language does not allow local
// variables in a function's **outermost** scope to shadow function parameters:
// in the code below, the **first** variable declaration is an error, but the
// other three are valid. (Try it in the interpreter!)

/*
num example(num arg1) {
	declare arg1 = true;
	declare arg2 = true;
	{
		declare arg1 = true;
		declare arg2 = true;
	}
	return 0;
}
*/

// Modify the interpreter code so that local variables are able to shadow
// function parameters. When done correctly, the example above and other similar
// examples should run without an error, because the first variable declaration
// will shadow the function parameter.

// Nothing else about the toy language should change. For example, this code
// must still produce a scope error after your changes:

/*
num example(num arg1) {
	declare arg2 = true;
	declare arg2 = true;
	return 0;
}
*/

// You must only modify these files:
//   StaticAnalysis/Program.ts
//   Execution/Expression.ts

// It is possible to solve this exercise with very little code, but you will not
// be able to solve this exercise by randomly guessing. Please don't waste your
// time! To solve this exercise, you need to understand how the stack of nested
// scopes interacts with the code that typechecks function definitions and the
// code that executes function calls.

// ******************
// * EXERCISE 1 END *
// ******************


// ********************
// * EXERCISE 2 START *
// ********************

// There is one feature of this toy language that is already implemented in the
// syntax analysis phase, but not in the static analysis or execution phases: we
// will call it a *composed function call*.

// (This is a very limited form of a common pattern in functional programming,
// but we're going to implement it in this toy language **without** the feature
// of *higher-order functions* that characterizes functional languages.)

// A composed function call is written with the special keyword "compose". There
// are **two** lists of information passed between parentheses: a non-empty list
// of function names and a possibly-empty list of arguments.

// The first (leftmost) function name is called with the provided arguments. If
// there is only one function name, the result of the whole expression is the
// return value of that function call. If there is more than one function name,
// each subsequent function is called on the *return value* of the previous
// function, from left to right.

// For example:
//   compose(f)()                       is like   f()
//   compose(f, g)()                    is like   g(f())
//   compose(f)(1)                      is like   f(1)
//   compose(f)(1, 2)                   is like   f(1, 2)
//   compose(f, g)(1, 2, 3)             is like   g(f(1, 2, 3))
//   compose(f, g, h)(1, a(2), 3 * 4)   is like   h(g(f(1, a(2), 3 * 4))

// Implement the typechecking and execution code for this feature so that it
// works according to this specification. Your typechecking code should be
// *sound* and *complete*: it should allow every valid call and disallow every
// invalid call according to the language specification.

// You must only modify these files:
//   StaticAnalysis/Program.ts
//   Execution/Expression.ts
//   Postprocessors.ts

// You might not need to modify all of these files, but you must not modify any
// other files.

// There are a few different reasonable ways to solve this problem. You might
// find it helpful to think about the concept of *syntactic sugar*, although
// it's not the only valid approach.

// ******************
// * EXERCISE 2 END *
// ******************