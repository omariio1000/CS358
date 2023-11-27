@preprocessor typescript

@{%
  import {
    unparenthesize,
    buildPlusExpr, buildMinusExpr, buildTimesExpr, buildDivideExpr, buildExponentExpr,
    buildAndExpr, buildOrExpr, buildLessThanExpr, buildEqualExpr,
    buildNegateExpr, buildNotExpr,
    buildInputExpr, buildCallExpr, buildComposeExpr,
    buildNumLeaf, buildBoolLeaf, buildVarLeaf,
    buildEmptyList, buildSingletonArgList, buildMultiArgList,
    buildSingletonNameList, buildMultiNameList,
  } from "../../src/SyntaxAnalysis/Postprocessors"
%}

@lexer lexer


expression1 -> expression2 %or expression1
  {% buildOrExpr %}

expression1 -> expression2
  {% id %}


expression2 -> expression3 %and expression2
  {% buildAndExpr %}

expression2 -> expression3
  {% id %}


expression3 -> expression4 %equal expression3
  {% buildEqualExpr %}

expression3 -> expression4
  {% id %}


expression4 -> expression5 %lessThan expression4
  {% buildLessThanExpr %}

expression4 -> expression5
  {% id %}


expression5 -> expression6 %plus expression5
  {% buildPlusExpr %}

expression5 -> expression6 %dash expression5
  {% buildMinusExpr %}

expression5 -> expression6
  {% id %}


expression6 -> expression7 %times expression6
  {% buildTimesExpr %}

expression6 -> expression7 %divide expression6
  {% buildDivideExpr %}

expression6 -> expression7
  {% id %}


expression7 -> expression7 %exponent expression8
  {% buildExponentExpr %}

expression7 -> expression8
  {% id %}


expression8 -> %dash expression8
  {% buildNegateExpr %}

expression8 -> %not expression8
  {% buildNotExpr %}

expression8 -> atom {% id %}


atom -> call
  {% id %}

atom -> %parenL expression1 %parenR
  {% postprocessWith(unparenthesize) %}

atom -> %input %lessThan %type %greaterThan
  {% postprocessWith(buildInputExpr) %}

atom -> value
  {% id %}

atom -> %name
  {% postprocessWith(buildVarLeaf) %}


call -> %name %parenL arglist %parenR
  {% postprocessWith(buildCallExpr) %}

call -> %compose %parenL namelist %parenR %parenL arglist %parenR
  {% postprocessWith(buildComposeExpr) %}


value -> %float
  {% postprocessWith(buildNumLeaf) %}

value -> %bool
  {% postprocessWith(buildBoolLeaf) %}


namelist -> %name
  {% postprocessWith(buildSingletonNameList) %}

namelist -> %name %comma namelist
  {% postprocessWith(buildMultiNameList) %}


arglist -> arglist_empty {% id %}
arglist -> arglist_nonempty {% id %}

arglist_empty -> null
  {% postprocessWith(buildEmptyList) %}

arglist_nonempty -> expression1
  {% postprocessWith(buildSingletonArgList) %}

arglist_nonempty -> expression1 %comma arglist_nonempty
  {% postprocessWith(buildMultiArgList) %}