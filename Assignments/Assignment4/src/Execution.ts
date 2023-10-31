import { Scope, AST, Value, lookup } from "./AST";

export class ExecutionError extends Error { }

// Compared to assignment 3, our execution code this time just has two more
// cases for the PrefixOpNode types. In assignment 5 we'll start to look at
// better ways to organize this big pile of code, but for now it might be
// helpful to have it all written out very explicitly.
export function execute(scope: Scope, tree: AST): Value {
  switch (tree.tag) {
    case "num":
    case "bool":
      return tree;

    case "name":
      return lookup(tree.name, scope);

    case "plus": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "num" || rightValue.tag != "num")
        throw new ExecutionError("invalid operand types for addition");
      return { tag: "num", value: leftValue.value + rightValue.value };
    }

    case "minus": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "num" || rightValue.tag != "num")
        throw new ExecutionError("invalid operand types for subtraction");
      return { tag: "num", value: leftValue.value - rightValue.value };
    }

    case "times": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "num" || rightValue.tag != "num")
        throw new ExecutionError("invalid operand types for multiplication");
      return { tag: "num", value: leftValue.value * rightValue.value };
    }

    case "divide": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "num" || rightValue.tag != "num")
        throw new ExecutionError("invalid operand types for division");
      if (rightValue.value == 0)
        throw new ExecutionError("division by zero");
      return { tag: "num", value: leftValue.value / rightValue.value };
    }

    case "exponent": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "num" || rightValue.tag != "num")
        throw new ExecutionError("invalid operand types for exponent");
      return { tag: "num", value: leftValue.value ** rightValue.value };
    }

    case "and": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "bool" || rightValue.tag != "bool")
        throw new ExecutionError("invalid operand types for logical AND");
      return { tag: "bool", value: leftValue.value && rightValue.value };
    }

    case "or": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "bool" || rightValue.tag != "bool")
        throw new ExecutionError("invalid operand types for logical OR");
      return { tag: "bool", value: leftValue.value || rightValue.value };
    }

    case "less": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != "num" || rightValue.tag != "num")
        throw new ExecutionError("invalid operand types for less-than comparison");
      return { tag: "bool", value: leftValue.value < rightValue.value };
    }

    case "equal": {
      const leftValue = execute(scope, tree.leftSubtree);
      const rightValue = execute(scope, tree.rightSubtree);
      if (leftValue.tag != rightValue.tag)
        throw new ExecutionError("invalid operand types for equality comparison");
      return { tag: "bool", value: leftValue.value == rightValue.value };
    }

    case "negate": {
      const subvalue = execute(scope, tree.subtree);
      if (subvalue.tag != "num")
        throw new ExecutionError("invalid operand types for negation");
      return { tag: "num", value: -subvalue.value };
    }

    case "not": {
      const subvalue = execute(scope, tree.subtree);
      if (subvalue.tag != "bool")
        throw new ExecutionError("invalid operand types for logical NOT");
      return { tag: "bool", value: !subvalue.value };
    }
  }
}