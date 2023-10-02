# CS 358

## Assignment 2

In this assignment, we'll extend our tiny language of Boolean logic from assignment 1. This time, we'll introduce support for a very simple kind of *variables* in our language, where the value of each variable is set before the program's execution begins. We'll cover more interesting kinds of variables later in the course, but we have to build up to them.

The goal of this assignment is to get you some more exercise with manipulating abstract syntax trees (ASTs), and to introduce the concepts of *scope* and *binding*, which will be fundamental throughout the course.

### Getting help

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-358-assignment-2/-/archive/main/cs-358-assignment-2-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the ***folder*** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: ***open the folder itself***, not any file ***in*** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

### Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

Each assignment in this course will have you reading through comments in the `src/Main.ts` file. **After reading the rest of this README**, open that file to start the assignment.

The `src/Library.ts` file from assignment 1 has become the `src/Library` folder, but it still serves the same purpose. You're not expected to read or understand this code, and you shouldn't modify it, but you're welcome to ask about it if you're curious!

When you're finished with your code, submit it to the assignment 2 dropbox on Canvas with the same submission instructions as in assignment 1. The soft deadline for this assignment is listed on its Canvas dropbox page.

### Code requirements

The general code requirements that you're expected to follow are also the same as in assignment 1. Make sure to review the assignment 1 README if you need to!

You are always allowed to **call existing functions** and **add new functions** in assignment code, **unless an exercise explicitly says not to**.

### Input on the page

- *Names* can include any lowercase or uppercase letter but no punctuation or spaces, like `x`, `abc`, and `Name`.
- *Boolean expressions* can include **OR, NOT, parentheses, Booleans, and names**, like `true`, `false || abc`, and `!(true || x) || !!(!y + !!z)`.
- *Scopes* are **comma-separated lists of variable definitions**, like `x = true` and `a = true, bc = false, def = true`. To input an empty scope, leave the input box empty.

### Grading

Each exercise is worth five points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
