// This assignment will be very similar to part 2 of assignment 1: the tree
// type that we're working with is almost the same as it was in assignment 1.

// We're adding in one brand new feature this time: our tree type has a new
// type of leaf that represents a *variable name*. This means our Boolean
// expressions can now contain variable names, and when we interpret an
// expression to calculate its value, we'll have to provide values for any
// names in the expression.

// We're going to start slow with these concepts, so for now our language does
// not have any way to create or modify variables within a "program"; instead,
// we set the constant value of each variable **before** the interpreter starts
// running. This is roughly like passing command-line arguments to a program.

// Our AST (*abstract syntax tree*) type looks just like our LogicTree type
// from assignment 1, except with an extra case for NameLeaf.
export type AST = OrNode | NotNode | BoolLeaf | NameLeaf;

// The OrNode, NotNode, and BoolLeaf types look just the same as they did in
// assignment 1.

export type OrNode = {
  readonly tag: "or";
  readonly leftSubtree: AST;
  readonly rightSubtree: AST;
};

export type NotNode = {
  readonly tag: "not";
  readonly subtree: AST;
};

export type BoolLeaf = {
  readonly tag: "bool";
  readonly value: boolean;
};

// The NameLeaf type is new in this assignment: it represents a *use* of a
// variable in an expression.
export type NameLeaf = {
  readonly tag: "name";
  readonly name: string;
};


// As in assignment 1, we use *object literal* syntax to build our trees.
// Remember that you can use the debugger to step through this example if you
// want to inspect these values.
export function sampleTree(): AST {
  const tree1: AST = { tag: "name", name: "x" };
  const tree2: AST = { tag: "bool", value: true };
  const tree3: AST = {
    tag: "or",
    leftSubtree: tree1,
    rightSubtree: tree2
  };
  return {
    tag: "not",
    subtree: tree3
  };
}

// Here's the function that the webpage uses to convert trees back to strings.
export function astToString(tree: AST): string {
  switch (tree.tag) {
    case "or":
      return (
        "(" + astToString(tree.leftSubtree) +
        " || " + astToString(tree.rightSubtree) +
        ")"
      );

    case "not":
      return "(! " + astToString(tree.subtree) + ")";

    case "bool":
      return tree.value.toString();

    case "name":
      return tree.name;
  }
}


// When we interpret an expression that contains variables, how do we know what
// value each variable should have?

// Our interpreter function needs a way to *map* variable names to variable
// values, in this case Booleans. In PL terminology, we need a *binding* for
// each variable in our program: a known definition that says what the exact
// value of the variable is.

// A *scope* is fundamentally a collection of variable *bindings*. Scopes can
// get quite complex, but in this assignment we will only have one simple scope
// in our whole program: all of our variables are *global* and *constant*.

// The Map<string, boolean> type contains a collection of "slots" or "cells",
// each **indexed by** a string and **containing** a Boolean. You don't really
// need to worry about the specifics of how the Map type works - we'll only be
// interacting with it using the lookup function provided below.
export type Scope = Map<string, boolean>;


// To create a scope, we can use the Map constructor, which takes kind of an odd
// pattern of arguments. You won't need to create any scope values in this
// assignment, but it may be helpful to use this function to inspect them in the
// debugger in order to make sure you understand what a scope value looks like.
export function sampleScope(): Scope {
  // An empty scope can be constructed with the zero-argument Map constructor.
  const scope1 = new Map();

  // A non-empty scope is constructed with the **one-argument** Map
  // constructor, which takes an **array of two-element arrays**. Each inner
  // array represents a single *variable binding* in our language. In each
  // inner array, the first element is the name of the variable being defined,
  // and the second element is the value of the variable. This scope defines x
  // = 1 and y = 2; note the outer **and** inner square brackets, which are all
  // necessary.
  const scope2 = new Map([
    ["x", true], ["y", false]
  ]);

  // Each variable in a scope has a unique binding: if we try to build a scope
  // with more than one binding for the same variable, only the **last** binding
  // is actually used. In this scope, x = false, which you can verify on the webpage
  // and in the debugger.
  const scope3 = new Map([
    ["x", true], ["x", false], ["y", true]
  ]);

  return scope3;
}


// Since our expressions can now have variables, they can also have *errors* if
// it turns out that a program contains an undefined variable. For now, we'll
// just throw a TypeScript exception if this happens.

// It's good practice to define a new custom exception type for each different
// kind of exception we plan to throw. The extends keyword is how we do
// subclassing in TypeScript; the Error class is just some built-in magic that
// makes thrown exceptions nicer to debug.
export class ScopeError extends Error { }

// This function is our only interface for using the Scope type, for now. The
// lookup function allows us to access the value of a variable in a scope, and
// throws a ScopeError if the variable does not have a binding in the scope.
export function lookup(name: string, scope: Scope): boolean {
  // The .get function on the Map<string, boolean> type takes a string and gives
  // back either a Boolean or a value equal to null. If the variable name has a
  // binding in the scope, we get its value; otherwise, we get back null.
  const value = scope.get(name);

  // The purpose of this lookup function is to wrap the .get function and throw
  // an exception if it returns null. This is convenient in our interpreter.
  if (value == null)
    throw new ScopeError("name is not in scope: " + name);

  // If the value isn't null, it contains the value of the variable that we
  // looked up by name.
  return value;
}

// Now when we want to interpret an expression to find its value, we can take
// in a scope to tell our interpreter what the value of each variable should
// be.
export function interpret(scope: Scope, tree: AST): boolean {
  // Like in assignment 1, we *traverse* an AST by branching on its tag.
  switch (tree.tag) {
    // If the root of the tree is a OrNode, we recursively interpret its two
    // subtrees and then add their result. Note that we pass the scope value to
    // the next recursive call, so that it's available at every level of the
    // recursion.
    case "or":
      return (
        interpret(scope, tree.leftSubtree) ||
        interpret(scope, tree.rightSubtree)
      );

    // If the root of the tree is a NotNode, we recursively interpret its
    // only subtree and then negate its result.
    case "not":
      return ! interpret(scope, tree.subtree);

    // If the root of the tree is a BoolLeaf, we just return its value.
    case "bool":
      return tree.value;

    // Finally, our new case: if the root of the tree is a NameLeaf, we use
    // lookup to find its value in our scope.
    case "name":
      return lookup(tree.name, scope);
  }
}



// **********
// EXERCISE 1
// **********

// Implement the countNameOccurrences function so that it returns the number of
// NameLeaf values in the tree that contain the given name.

// For example:

//   name: "x"
//   tree: 1 + 2
//   output: 0

//   name: "x"
//   tree: x + 1
//   output: 1

//   name: "x"
//   tree: -(x + x) + y
//   output: 2

// You must not use the astToString function or convert the input AST to a
// string in any other way. It is theoretically possible to solve this problem
// that way, but that's not the exercise that we're aiming for here.

// Delete the entire "throw" line below and replace it with your code.

export function countNameOccurrences(name: string, tree: AST): number {
  throw new Error("unimplemented - this one is your job");
}

// **************
// EXERCISE 1 END
// **************


// ****************
// EXERCISE 2 START
// ****************

// Implement the removeDoubleNegations function so that it removes all
// **double** negations from the tree. Pay close attention to this detail in
// the examples below!

// For example:

//   tree: !true
//   output: !true

//   tree: !!true
//   output: true

//   tree: !!x
//   output: x

//   tree: !!!true
//   output: !1

//   tree: !!!(true || false)
//   output: !(true || false)

//   tree: !!!(!!true || !!!false)
//   output: !(true || !false)

//   tree: !!!!!(!!true || !!!false)
//   output: !(true || !false)

// Delete the entire "throw" line below and replace it with your code.

export function removeDoubleNegations(tree: AST): AST {
  throw new Error("unimplemented - this one is your job");
}

// **************
// EXERCISE 2 END
// **************


// ****************
// EXERCISE 3 START
// ****************

// Implement the substituteAllNames function so that it replaces each NameLeaf
// with the value from the corresponding binding in the given scope.

// For example:

//   scope: x = true, y = false
//   tree: x || false
//   output: true || false

//   scope: x = true, y = false
//   tree: x || y
//   output: true || false

//   scope: x = true, y = false
//   tree: !x || !(y || x)
//   output: !true || !(false || true)

// You may assume that all variables in the tree have bindings in the scope, so
// the lookup function will never throw a ScopeError. When we test your code for
// grading, we will only test it in "safe" cases like this.

// **You may not call the .get() method directly in your code.**
// Read the comments in this file to learn how to use the Scope type!

// Delete the entire "throw" line below and replace it with your code.

export function substituteAllNames(scope: Scope, tree: AST): AST {
  throw new Error("unimplemented - this one is your job");
}

// **************
// EXERCISE 3 END
// **************

// ****************
// EXERCISE 4 START
// ****************

// Implement the equalExceptNames function so that it decides whether the two
// trees are have the same structure except for the names in each NameLeaf.

// For example:

//   tree1: true || true
//   tree2: true || true
//   output: true

//   tree1: true || false
//   tree2: true || true
//   output: false

//   tree1: true
//   tree2: true || true
//   output: false

//   tree1: x
//   tree2: true
//   output: false

//   tree1: x
//   tree2: x
//   output: true

//   tree1: x
//   tree2: y
//   output: true

//   tree1: true || x
//   tree2: true || y
//   output: true

//   tree1: !(!a || x)
//   tree2: !(!b || y)
//   output: true

//   tree1: !(!a || x)
//   tree2: !(b || !y)
//   output: false

// Delete the entire "throw" line below and replace it with your code.

export function equalExceptNames(tree1: AST, tree2: AST): boolean {
  return false;
}