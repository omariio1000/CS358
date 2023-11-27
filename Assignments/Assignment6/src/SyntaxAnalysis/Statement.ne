@preprocessor typescript

@{%
  import {
    buildCommandStmt,
    buildVarDeclStmt, buildVarUpdateStmt, buildPrintStmt,
    buildBlockStmt, buildIfStmt, buildWhileStmt
  } from "../../src/SyntaxAnalysis/Postprocessors"
%}


@lexer lexer

statement -> command %semicolon
  {% postprocessWith(buildCommandStmt) %}

statement -> compound
  {% id %}


command -> call
  {% id %}

command -> %declare %name %assign expression1
  {% postprocessWith(buildVarDeclStmt) %}

command -> %name %assign expression1
  {% postprocessWith(buildVarUpdateStmt) %}

command -> %print expression1
  {% postprocessWith(buildPrintStmt) %}


compound -> %curlyL statement:* %curlyR
  {% postprocessWith(buildBlockStmt) %}

compound -> %if_ %parenL expression1 %parenR statement (%else_ statement):?
  {% postprocessWith(buildIfStmt) %}

compound -> %while_ %parenL expression1 %parenR statement
  {% postprocessWith(buildWhileStmt) %}


@include "./Expression.ne"
