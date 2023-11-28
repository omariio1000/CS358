import { Expr, Value } from "../AST";
import { input } from "../Library/Runtime";
import { Program, dispatch } from "../Program";

import { DynamicNestedScope, declare, lookup, popLocalScope, pushLocalScope } from "../Scope";
import { executeStmt } from "./Statement";
import { assertNum, assertBool, assertSameType, DynamicTypeError } from "./TypeAssertions";

export function executeExpr(
  prog: Program,
  scope: DynamicNestedScope,
  expr: Expr
): Value {
  switch (expr.tag) {
    case "call": {
      // Look up the definition of the function by its name.
      const func = dispatch(prog, expr.functionName);

      // Make sure this function call has passed the same number of arguments
      // that the function definition expects.
      if (func.parameters.length != expr.arguments.length)
        throw new DynamicTypeError("incorrect argument count");

      // Execute each argument expression to get the argument values.
      const values: Value[] = [];
      for (const arg of expr.arguments)
        values.push(executeExpr(prog, scope, arg));

      // Enter a new local scope for the function call to execute in.
      pushLocalScope(scope);

      // Define each of the arguments in the function call's local scope.
      for (let i = 0; i < values.length; i++) {
        const param = func.parameters[i];
        const value = values[i];
        declare(param.name, value, scope);
      }

      pushLocalScope(scope);
    
      // Execute each statement in the body of the function. This might declare
      // new variables in the function call's local scope.
      for (const stmt of func.body)
        executeStmt(prog, scope, stmt);

      // Execute the return expression to get the return value. This might
      // access new variables that were declared while executing the function
      // body.
      const returnValue = executeExpr(prog, scope, func.returnExpr);

      popLocalScope(scope);
      // Exit the function call's local scope.
      popLocalScope(scope);

      // Return the return value from the function call.
      return returnValue;
    }

    case "compose": {
      const ret: Value[] = [];
      for (let i = 0; i < expr.functionNames.length; i++) {
        const func = dispatch(prog, expr.functionNames[i]);
        const values: Value[] = [];
        if (i == 0) {
          // Make sure this function call has passed the same number of arguments
          // that the function definition expects.
          if (func.parameters.length != expr.arguments.length)
            throw new DynamicTypeError("incorrect argument count");

          // Execute each argument expression to get the argument values.
          
          for (const arg of expr.arguments)
            values.push(executeExpr(prog, scope, arg));

        }
        else {
          if (func.parameters.length != 1) 
            throw new DynamicTypeError("incorrect argument count");

            values.push(ret[i - 1]);
        }

        
        // Enter a new local scope for the function call to execute in.
        pushLocalScope(scope);

        // Define each of the arguments in the function call's local scope.
        for (let i = 0; i < values.length; i++) {
          const param = func.parameters[i];
          const value = values[i];
          declare(param.name, value, scope);
        }

        pushLocalScope(scope);
      
        // Execute each statement in the body of the function. This might declare
        // new variables in the function call's local scope.
        for (const stmt of func.body)
          executeStmt(prog, scope, stmt);

        // Execute the return expression to get the return value. This might
        // access new variables that were declared while executing the function
        // body.
        const returnValue = executeExpr(prog, scope, func.returnExpr);

        popLocalScope(scope);
        // Exit the function call's local scope.
        popLocalScope(scope);

        ret[i] = returnValue;
      }
      
      return ret[expr.functionNames.length - 1];
    }

    case "plus": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue + rightValue;
    }

    case "minus": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue - rightValue;
    }

    case "times": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue * rightValue;
    }

    case "divide": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue / rightValue;
    }

    case "exponent": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue ** rightValue;
    }

    case "and": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertBool(leftValue);
      assertBool(rightValue);
      return leftValue && rightValue;
    }

    case "or": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertBool(leftValue);
      assertBool(rightValue);
      return leftValue || rightValue;
    }

    case "lessThan": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue < rightValue;
    }

    case "equal": {
      const leftValue = executeExpr(prog, scope, expr.leftSubexpr);
      const rightValue = executeExpr(prog, scope, expr.rightSubexpr);
      assertSameType(leftValue, rightValue);
      return leftValue == rightValue;
    }

    case "negate": {
      const value = executeExpr(prog, scope, expr.subexpr);
      assertNum(value);
      return - value;
    }

    case "not": {
      const value = executeExpr(prog, scope, expr.subexpr);
      assertBool(value);
      return ! value;
    }

    case "input":
      return input(expr.type);

    case "var":
      return lookup(expr.name, scope);

    case "num":
    case "bool":
      return expr.value;
  }
}
