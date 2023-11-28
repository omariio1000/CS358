import { ValueType, Expr, InfixExpr, PrefixExpr, Value } from "../AST";
import { Program, dispatch } from "../Program";
import { StaticNestedScope, lookup } from "../Scope";
import { StaticTypeError, assertType } from "./TypeAssertions";

function inferInfixExprType(
  prog: Program,
  operandType: ValueType,
  resultType: ValueType,
  scope: StaticNestedScope,
  expr: InfixExpr
): ValueType {
  const leftType = inferExprType(prog, scope, expr.leftSubexpr);
  const rightType = inferExprType(prog, scope, expr.rightSubexpr);

  assertType(operandType, leftType);
  assertType(operandType, rightType);

  return resultType;
}

function inferPrefixExprType(
  prog: Program,
  operandType: ValueType,
  resultType: ValueType,
  scope: StaticNestedScope,
  expr: PrefixExpr
): ValueType {
  const type = inferExprType(prog, scope, expr.subexpr);
  assertType(operandType, type);
  return resultType;
}

export function inferValueType(value: Value): ValueType {
  switch (typeof value) {
    case "number": return "num";
    case "boolean": return "bool";
  }
}

export function inferExprType(
  prog: Program,
  scope: StaticNestedScope,
  expr: Expr
): ValueType {
  switch (expr.tag) {
    case "call": {
      const func = dispatch(prog, expr.functionName);
      if (func.parameters.length != expr.arguments.length)
        throw new StaticTypeError("incorrect argument count");

      for (let i = 0; i < expr.arguments.length; i++) {
        const param = func.parameters[i];
        const arg = expr.arguments[i];
        assertType(param.type, inferExprType(prog, scope, arg));
      }

      return func.returnType;
    }

    case "compose": {
      const func1 = dispatch(prog, expr.functionNames[0]);

      if (func1.parameters.length != expr.arguments.length)
        throw new StaticTypeError("incorrect argument count");

      for (let i = 0; i < expr.arguments.length; i++) {
        const param = func1.parameters[i];
        const arg = expr.arguments[i];
        assertType(param.type, inferExprType(prog, scope, arg));
      }

      const ret: ValueType[] = [];
      ret.push(func1.returnType);

      for (let i = 1; i < expr.functionNames.length; i++) {
        const func = dispatch(prog, expr.functionNames[i]);
        if (func.parameters.length != 1)
          throw new StaticTypeError("incorrect argument count");

        const param = func.parameters[0];
        assertType(param.type, ret[i - 1]);

        ret.push(func.returnType);
      }
      
      return ret[expr.functionNames.length - 1];
    }

    case "plus":
    case "minus":
    case "times":
    case "divide":
    case "exponent":
      return inferInfixExprType(prog, "num", "num", scope, expr);

    case "negate":
      return inferPrefixExprType(prog, "num", "num", scope, expr);

    case "not":
      return inferPrefixExprType(prog, "bool", "bool", scope, expr);

    case "equal": {
      const leftType = inferExprType(prog, scope, expr.leftSubexpr);
      const rightType = inferExprType(prog, scope, expr.rightSubexpr);
      assertType(leftType, rightType);
      return "bool";
    }

    case "input":
      return expr.type;

    case "var":
      return lookup(expr.name, scope);

    case "num":
    case "bool":
      return expr.tag;

    case "lessThan":
      return inferInfixExprType(prog, "num", "bool", scope, expr);

    case "and":
    case "or":
      return inferInfixExprType(prog, "bool", "bool", scope, expr);
  }
}