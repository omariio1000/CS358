# CS 358, Fall 2023

# Assignment 6

In this assignment, we will extend the toy language that we've been building with *function definitions* and *function calls*. This will depend heavily on the code patterns we saw in assignment 5, extended to interact with our stack of scopes in a more interesting way.

## Getting help

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for me to help you!

## Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-358-assignment-6-fall-2023/-/archive/main/cs-358-assignment-6-fall-2023-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the **folder** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: **open the folder itself**, not any file **in** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

## Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

## The language

### Function definitions

Function definitions in our toy language are written in C-style notation:

```
num foo(num x, bool y) {
  declare z = 0;
  if (y)
    z = x;
  return z;
}
```

There are two notable restrictions:

- The only types are `num` and `bool`; there is no `void` type, so every function must return some value.
- There is no support for early `return` statements: every function must have **exactly one** `return` statement, and it must be the last line of the function.

### Function calls

Function calls are also written in the familiar C-style notation: for example `foo(1, true)`.

Just like in **every** modern programming language, function calls can be nested: for example `foo(bar(1), baz(false, 2))`.

## The code

Read through the AST, Execution, and StaticAnalysis folders very carefully. This code is an extension on the code from assignment 5, so make sure you understand that code well. As usual, **YOU SHOULD SPEND WAY, WAY, WAY MORE TIME READING THAN WRITING**.

When you're ready, open `src/Main.ts` to start the exercises.

## Grading

The first exercise is worth three points, the second exercise is worth five, and the third exercise is worth twelve. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
