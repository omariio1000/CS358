# CS 358, Fall 2023

## Assignment 4

This assignment focuses on the implementation of a *parser* for a small extension of the language from assignment 3. The goal is to give you some hands-on experience working on the code of a parser in a relatively realistic style, although still for a very simple toy language.

Parsers are ubiquitous: every application that can read files in some particular file format must include some code for parsing that file format. In PL we focus on parsing *text* files, but *binary* files are also parsed by very similar methods: think filetypes like `.png`, `.zip`, and `.mp3`.

This assignment depends heavily on the week 5 lecture material, so make sure to review the notes and lectures while you're working through it!

### Getting help

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-358-assignment-4-fall-2023/-/archive/main/cs-358-assignment-4-fall-2023-main.zip>.

### Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

### The language

The language this time is the same as in assignment 3, but with two new *prefix* operators:
- `-` for numeric negation
- `!` for boolean negation (NOT)

These give us an opportunity to explore how prefix operators and infix operators interact in parsing rules.

### The webpage

The webpage is also the same as in assignment 3, but instead of a fixity table on the webpage, the parsing is controlled by the parsing rules in `src/Grammar/Expression.ne`. You will need to rebuild the project and reload the webpage after modifying these rules in order to see any changes take effect.

### Grading

There is one exercise which has you fix five bugs; each bug is worth four points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your code must work as specified for **all possible inputs**, not just for the specific inputs that are tested in the automated tests.