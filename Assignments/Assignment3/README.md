# CS 358

## Assignment 3

In this assignment, we'll start to explore the topic of *syntax analysis*. This is a deep topic, so we'll explore it over multiple assignments.

This assignment covers two key concepts in the topic of syntax analysis:
- the *phase structure* of an interpreter and how syntax analysis relates to the *execution* phase
- the definition of an *order of operations* in terms of *precedence* and *associativity*

You won't be implementing a *parser* by hand yet, but you'll get to explore how some of the high-level properties of a parser affect the behavior of an interpreter. In the next assignment we'll explore the techniques that we use to realize these properties in a parsing algorithm.

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-358-assignment-3-fall-2023/-/archive/main/cs-358-assignment-3-fall-2023-main.zip>.

### Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

### The language

The language we're working with in this assignment is an **extension of the language from assignment 2**. The language now supports *floating-point numbers* and eight *infix operators*: `&&`, `||`, `<`, `==`, `+`, `-`, `*`, and `/`.

The interpreter for this language does a form of *dynamic type checking*: the *execution phase* will fail if the operands to an infix operator have the wrong types.
- `&&` and `||` require boolean values on both sides
- `<`, `+`, `-`, `*`, and `/` require floating-point values on both sides
- `==` requires both sides to be the same type

### The webpage

The *fixity* of an operator is defined by its *precedence* and *associativity*. In the *fixity table*, you can specify the fixity for each operator in the language as a non-negative number followed by the string `left` or `right`. The number controls the precedence of the operator, and the string controls the associativity.

The *runtime scope* text box takes a comma-separated lists of variable definitions, like `x = true` and `a = true, bc = 123.456, def = false`. To input an empty scope, leave the input box empty. Note that the runtime scope **only affects the execution phase**: the outputs of tokenizing and parsing are unaffected by it.

The *program source code* text box takes an *expression* involving boolean values, floating-point numbers, variable names, and the eight operators that the language supports. When you run the program, the expression is *parsed* using the fixity table, and then the resulting AST is *executed* using the runtime scope.

Take some time to explore how the page works before working on the assignment exercises - some thoughtful experimentation will go a long way!

### Grading

Each exercise is worth five points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
