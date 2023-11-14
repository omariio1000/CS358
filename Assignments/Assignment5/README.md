# CS 358, Fall 2023

# Assignment 5

In this assignment, we will extend the toy language that we've been building with *imperative* features and a *typechecker*. Since our code has gotten pretty large at this point, we'll also explore some better ways to **organize** this kind of codebase using features of TypeScript's own type system.

## Getting help

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for me to help you!

## Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-358-assignment-5-fall-2023/-/archive/main/cs-358-assignment-5-fall-2023-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the **folder** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: **open the folder itself**, not any file **in** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

## Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

## The language

Our toy language has been extended with some new and modified features.

### Static typechecking

Our language is now *statically-typed*, with two types `"num"` and `"bool"` and a static typechecker to predict type errors related to these two types. In the syntax descriptions below, the symbol `t` stands for any type.

### Values

Our language now supports two *types* of data *values*: floating-point numbers and booleans.

#### Floating-point numbers

Floating-point numbers are written like in all common programming languages (the way you would most likely expect them to be written).

Keep in mind that floating-point arithmetic sometimes produces weird results: for example, `1 / 0` will evaluate to `Infinity`. There will also be rounding errors with some fractional numbers, and overflow/underflow behavior with very large or small numbers. These behaviors are all *correct* by the rules of floating-point arithmetic ([IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)), even though they're very different from how we usually expect "numbers" to work in traditional arithmetic.

#### Booleans

Boolean values are written `true` and `false`, **always lowercase**. These are not valid variable names in the language.

### Expressions

Just like before, our language has *expressions*. Remember: an *expression* is a piece of code that produces a *value* when we interpret it.

#### Operators

Below is a list of **all of** the operators we have now - if something is not on this list, then it's not supported in this language.

This list also specifies the order of operations: the NOT operator in the list "comes first" when combining operators without parentheses. In each entry, the `e` names represent **any *expression***, not just any *variable* or *value*.

- logical NOT: `! e1`
- negation: `- e1`
- exponentiation: `e1 ^ e2`
- multiplication: `e1 * e2`, division: `e1 / e2`
- addition: `e1 + e2`, subtraction: `e1 - e2`
- less-than comparison: `e1 < e2`
- equality comparison: `e1 == e2`
- logical AND: `e1 && e2`
- logical OR: `e1 || e2`

Two of our operators have **changed meaning** slightly:

- Both the `&&` and `||` operators work on numbers as well as booleans now. Their meaning for booleans is the same as before, but for numbers they are *bitwise* operators: for example, `20 && 25 == 16` because `20` is `10100` in binary, `25` is `11001`, and `16` is `10000`.

The typechecker is not aware of the changed meanings of `&&` and `||` yet: that will be your job. The execution code is already implemented for the new behavior.

#### Input expressions

An *input expression* is written either `input<num>` or `input<bool>`, and at runtime it asks the user to input an expression of the appropriate type. If the user enters invalid input, it asks again until they enter valid input. In typechecking, `input<t>` has type `t`, because we assume that the user will eventually input a valid value of the correct type.

Note that an *input expression* is an *expression*, which means we can write code like `input<num> + input<num>` or `if (input<bool>) print 1;`. In general, an input expression can be used anywhere that any other expression can be used.

### Statements

Our language has several new features that take the form of *statements*. A *statement* is a piece of code that executes to produce some *side effect*: it **does not have a *value***, but instead produces some other kind of observable change in the *state* of the program.

Below is a list of **all of** the types of statements we have now - if something is not on this list, then it's not supported in this language.

In each entry, the `x` names represent any *variable name*, the `v` names represent any *value*, the `e` names represent any *expression*, and the `s` names represent any *statement*.

- variable declaration: `declare x = e;`
- variable update: `x = e;`
- print: `print e;`
- block: `{ s1; s2; ... }` (may have any number of substatements, including zero)
- if: `if (e) s1`, `if (e) s1 else s2`
- while statements: `while (e) s`
- switch statements: `switch (e) { v1: s1 ... vn: sn }`

Each of these features is already implemented in the *syntax analysis* and *execution* code. You will be implementing the static analysis code for switch statements.

#### Variable statements

Variables must be *declared* before they may be *used* or *updated*. It is a *scope error* to attempt to use or update a variable that has not been declared, or to declare a variable that has already been declared.

For example, `{ declare x = 1; print y; }`, `{ declare x = 1; y = 2 }`, and `{ declare x = 1; declare x = 2 }` will all produce scope errors (if `y` is not defined in an outer block).

Variables have *static types* which are *inferred* from their initial assigned value.

#### Block statements

A *block statement* executes each of its substatements in order. When the block statement ends, **variables that were declared in the block *go out of scope***.

For example, `{ declare x = 1; print x; }` is valid, but `{ { declare x = 1; print x; }; print x; }` will print `1` once and then throw a runtime scope error on the second `print` statement.

#### If statements

An *if statement* has a condition *expression*, which is expected to produce a boolean value, and a *true branch* and an optional *false branch*, which are both *statements*.

The value of the condition expression is used to choose which branch to execute. If the value is `false` and there is no false branch, the if statement does nothing.

In typechecking, the value of the condition expression is required to be a boolean.

#### While statements

A *while statement* works at runtime the way you would most likely expect: in each loop iteration, it checks if `e` evaluates to `true` and executes `s` if it does. In typechecking, `e` is required to be a `bool`.

#### Switch statements

A *switch statement* works **roughly** the way you would expect, but a little differently than in some common languages (including TypeScript). There is no *fall-through* and no `break` statement: each `case` is independent, and the order of the `case`s does not affect the behavior of the `switch` statement.

The part of the `switch` statement between parentheses is the *focus* (or *scrutinee*).

Each `case` must contain exactly one statement in its body, so if you want multiple statements in one `case`, you have to use a block statement. For example:

```
switch (input<num>) {
  case 1: print 1;
  case 2: {
    print 3;
    print 4;
  }
}
```

A `switch` statement may have an optional `default` clause, which executes if the *focus* (the expression in parentheses after the `switch` keyword) does not match any of the `case` values. The `default` clause **must come last** in a `switch`. For example:

```
switch (input<num>) {
  case 1: print 1;
  case 2: {
    print 3;
    print 4;
  }
  default: print 5;
}
```

If there is no `default` clause and the focus does not match any of the `case` values, the `switch` statement does nothing. (No error is thrown.)

It is valid for a `switch` statement to have zero `case`s and no `default` clause, which does nothing except evaluate the focus. This means that at runtime, `switch (input<num>) { }` will ask for an input number and then do nothing with it.

**Each `case` in a `switch` statement has its own *scope***, so variables declared in one `case` are not visible in any other `case` or outside the `switch`, and multiple `case`s in the same `switch` may declare the same variable name. For example, this code is well-typed (although pointless):

```
switch (input<bool>) {
  case true: declare x = 1;
  case false: declare x = true;
}
```

In typechecking, each `case` of a `switch` statement must have the same type as the focus. This is because in our language, a `bool` is never equal to a `num`, so it would always be a mistake to use a `bool` case with a `num` focus or vice versa. For example, this code has a type error in the second `case`:

```
switch (input<bool>) {
  case true: print 1;
  case 1: print 2;
}
```

### Scope

Recall the concept of *variable scope* from previous courses: a variable's scope is the part of the program it can be used in.

Our toy language now has the feature of *block scoping*. In general, this means that **a variable is only usable in the same AST subtree as its declaration**. Every use of a variable must also come after its declaration, in the array of sub-statements within a block statement.

This is the same way local variables work in nearly all modern languages. Don't let your existing intuition take over in this assignment, though: we're focusing on the **precise details** of block scoping, which may be slightly different than you intuitively expect.

For example, consider this nested block statement written as source code in our toy language:

```
{
  declare x = 1;
  for (y = x; y < 10; y = y + x) {
    declare z = x + y;
    print x * z;
  }
  print x;
}
```

You can see a visual rendering of the AST for this program by pasting the source code into the syntax analysis section of the webpage.

In **TypeScript** code, the AST for this program is an object that looks like this:

```
{
  tag: "block",
  blockStmts: [
    {
      tag: "varDecl",
      name: "x",
      initialExpr: { tag: "num", value: 1 }
    },
    {
      tag: "for",
      name: "y",
      initialExpr: { tag: "var", name: "x" },
      condition: {
        tag: "lessThan",
        leftSubexpr: { tag: "var", name: "y" },
        rightSubexpr: { tag: "num", value: 10 }
      },
      update: {
        tag: "varUpdate",
        name: "y",
        newExpr: {
          tag: "plus",
          leftSubexpr: { tag: "var", name: "y" }
          rightSubexpr: { tag: "var", name: "x" }
        },
        body: {
          tag: "block",
          blockStmts: [
            {
              tag: "varDecl",
              name: "z",
              initialExpr: {
                tag: "plus",
                leftSubexpr: { tag: "var", name: "x" },
                rightSubexpr: { tag: "var", name: "y" }
              }
            },
            {
              tag: "print",
              printExpr: {
                tag: "times",
                leftSubexpr: { tag: "var", name: "x" },
                rightSubexpr: { tag: "var", name: "z" }
              }
            }
          ]
        }
      }
    },
    {
      tag: "print",
      printExpr: { tag: "var", name: "x" }
    }
  ]
}
```

As usual, notice how the TypeScript code for the AST represents the same nested tree structure as the visual rendering that you can see on the webpage.

## The code

The interpreter structure is the same as in assignment 3, but with a new `StaticAnalysis` module and folder.

**Before** reading through the new code, read the documentation in `src/AST/Expression.ts` and `src/AST/Statement.ts` to see how we're representing the new language features in our AST types.

Next, read through the code in `src/Scope.ts` to see how our Scope type has changed to support our static analysis phase.

Look through the code in the `src/Execution` folder to note what's new since assignment 3. Focus on the execution code for the `<`/`&&`/`||` operators and for `switch` statements, since you'll be working on the typechecking code for these.

Take note of the `assertType` function in `src/StaticAnalysis/TypeAssertions`: this is a function that will help in the typechecking code you write.

The fundamental purpose of our typechecker is to predict the possibility of a `DynamicTypeError` in the execution code. If the typechecker detects this possibility, it throws a `StaticTypeError` to let us know. Our typechecker is *sound* if it throws a `StaticTypeError` for any code that **might** have a `DynamicTypeError`, and is *complete* if it never throws a `StaticTypeError` for any code that **can't** have a `DynamicTypeError`.

When you're ready, open `src/Main.ts` to start the exercises.

## Grading

The first exercise is worth three points, the second exercise is worth five, and the third exercise is worth twelve. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
