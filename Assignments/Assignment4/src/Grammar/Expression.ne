# This is a Nearley file used to *generate* the gen/Grammar/Expression.ts file.
# When this project is built, all of the .ne files are compiled to .ts files.

# Comments in a .ne file begin with a hash.

# We covered parsing with Nearley in week 5 of lecture. For a quick refresher,
# read **only** the "Vocabulary" section in the "Writing a parser" page from the
# Nearley documentation, found here:
# https://nearley.js.org/docs/grammar#vocabulary

# **DO NOT FOLLOW THE INSTALLATION INSTRUCTIONS IN THE NEARLEY DOCUMENTATION.**
# In this project, Nearley will be installed automatically through our usual
# "npm i" command.

# It might also be helpful to read the "Operator precedence is not black magic"
# section in the "How to grammar good" page from the Nearley documentation,
# found here:
# https://nearley.js.org/docs/how-to-grammar-good#operator-precedence-is-not-black-magic

# The rest of the Nearley documentation may be interesting, but won't be very
# relevant to this assignment: we're using Nearley in a relatively simple way,
# without using very many of its features.

# This command tells Nearley that we're using TypeScript (instead of
# JavaScript, which is the default.)
@preprocessor typescript

# We can include TypeScript code in a Nearley file between @{% and %} markers.
# Here we just import the types that we'll be using.
@{%
  // Within this block, we're writing TypeScript code, so we use TypeScript
  // comment syntax. This code is going to end up in the
  // gen/Grammar/Expression.ts file, so we use "../.." to navigate to the
  // project root in order to find the src folder.
  import {
    AST, InfixOpNode, PrefixOpNode, NumLeaf, NameLeaf
  } from "../../src/AST";

  import { Token } from "moo";
  import { tokenizer } from "../../src/Grammar/Tokenizer";

  import {
    unparenthesize,
    buildInfixOpNode, buildPrefixOpNode,
    buildNumLeaf, buildBoolLeaf, buildNameLeaf
  } from "../../src/Library/Parsing"
%}

# Out here we're writing Nearley code again instead of TypeScript code.

# This command tells Nearley that we want to use the lexer named "lexer" that
# we imported above. Without this command, we wouldn't have a lexer, and our
# parser would be acting on individual **characters** instead of *tokens*.
@lexer tokenizer

# Now that we have Nearley configured and we have all the imports we need, we
# define each *production rule* in our *context-free grammar*. Our *terminals*
# are the names of our lexer rules, which are written prefixed with a %, like
# %equal for the rule named "equal".

# Each production rule also comes with a *postprocessing* function, which does
# the work to actually construct the final AST. The postprocessing function is
# specified between {% and %}, and we call the postprocessWith function as a
# convenience wrapper that lets our postprocessing functions take in arguments
# in a more convenient way. All of these postprocessing functions are defined
# in src/Grammar/Postprocessors.ts, which has comments explaining the pattern.

# For the rules that generate terminal nodes, Library/Parsing.ts provides some
# postprocessing functions that "clean up" the output parse tree into a value of
# our AST type.
expression1 -> expression1 %equal expression2
  {% buildInfixOpNode("equal") %}

# For the "passthrough" rules that just generate a single nonterminal, Nearley
# provides a built-in "no-op" postprocessing function called id.
expression1 -> expression2
  {% id %}


expression2 -> expression3 %less expression2
  {% buildInfixOpNode("less") %}

expression2 -> expression3
  {% id %}


expression3 -> expression3 %or expression4
  {% buildInfixOpNode("or") %}

expression3 -> expression4
  {% id %}


expression4 -> expression4 %and expression5
  {% buildInfixOpNode("and") %}

expression4 -> expression5
  {% id %}


expression5 -> expression5 %plus expression6
  {% buildInfixOpNode("plus") %}

expression5 -> expression5 %dash expression6
  {% buildInfixOpNode("minus") %}

expression5 -> expression6
  {% id %}


expression6 -> expression7 %times expression6
  {% buildInfixOpNode("times") %}

expression6 -> expression7 %divide expression6
  {% buildInfixOpNode("divide") %}

expression6 -> expression7
  {% id %}


expression7 -> atom {% id %}

expression7 -> %dash expression7
  {% buildPrefixOpNode("negate") %}

expression7 -> %not expression7
  {% buildPrefixOpNode("not") %}


atom -> %parenL expression1 %parenR
  {% unparenthesize %}

atom -> %float
  {% buildNumLeaf %}

atom -> %bool
  {% buildBoolLeaf %}

atom -> %name
  {% buildNameLeaf %}