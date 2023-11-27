@preprocessor typescript

@{%
  import { lexer } from "../../src/SyntaxAnalysis/Lexer";
  import { postprocessWith } from "../../src/Library/Parsing";
  import {
    buildProgram, buildFunc,
    buildSingletonParamList,
    buildMultiParamList,
  } from "../../src/SyntaxAnalysis/Postprocessors"
%}

@lexer lexer

program -> function:*
  {% postprocessWith(buildProgram) %}

function -> %type %name %parenL paramlist %parenR %curlyL statement:* %return_ expression1 %semicolon %curlyR
  {% postprocessWith(buildFunc) %}

paramlist -> null
  {% postprocessWith(buildEmptyList) %}

paramlist -> paramlist_nonempty
  {% id %}

paramlist_nonempty -> %type %name
  {% postprocessWith(buildSingletonParamList) %}

paramlist_nonempty -> %type %name %comma paramlist_nonempty
  {% postprocessWith(buildMultiParamList) %}

@include "Statement.ne"