import { FixityTable } from "./Library/IO";

// These exception types are used by our interpreter to identify **which phase**
// an error comes from. TokenizingError and ParsingError are used by the
// provided library code, and ExecutionError is used in the execution code
// defined later in this file.
export class TokenizingError extends Error { }
export class ParsingError extends Error { }
export class ExecutionError extends Error { }

// The Fixity type is used to define the fixity of each operator. This data is
// only used during the parsing phase, but it **indirectly** affects the output
// of the execution phase for a given program.
export type Fixity = {
  precedence: number;
  associativity: "left" | "right";
}

// The AST type is the same as in assignment 2, but extended with a couple more
// node types to support the new syntactic features of the language. The AST is
// the output of the parsing phase, and the input to the execution phase.
export type AST = NumLeaf | BoolLeaf | NameLeaf | InfixOpNode;

export type NumLeaf = {
  tag: "num";
  value: number;
}

export type BoolLeaf = {
  tag: "bool";
  value: boolean;
}

export type NameLeaf = {
  tag: "name";
  name: string;
}

// An *infix* operator is one that's written **between** two operands, like all
// eight of the operators that this language supports.
export type InfixOpNode = {
  tag: "plus" | "minus" | "times" | "divide" | "or" | "and" | "less" | "equal";
  leftSubtree: AST;
  rightSubtree: AST;
}

// A *value* is the **result** of *executing* an *expression*. Since our
// language now has two types of values, we need a Value type that can represent
// both of them. Notice that a Value is **not** a tree, it's just a TypeScript
// number or boolean along with a tag indicating its type.
export type Value = NumLeaf | BoolLeaf;

// Our Scope type also changes to support both floating-point and boolean
// values, but other than that it works the same as in assignment 2. Note that
// the scope input on the webpage only affects the *execution* phase: *syntax*
// analysis just recognizes variable names as pieces of text, it doesn't try to
// analyze their *semantics*.
export type Scope = Map<string, Value>;

function lookup(name: string, scope: Scope): Value {
  const value = scope.get(name);
  if (value == null)
    throw new ExecutionError("name is not in scope: " + name);
  else
    return value;
}

// The execution function works more or less the same way as in assignment 2,
// but it has to check the tags of the operands in each binary operation so that
// it can throw *dynamic type errors* when the operands have unexpected types.
// This is different from *static typechecking*, which we'll explore later in
// the course when we explore *static analysis*.
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
  }
}

// ********************
// * EXERCISE 1 START *
// ********************

// Give five different non-empty strings of source code that each have a
// tokenizing error. Replace the empty strings below with your strings.

// None of your strings should be substrings of each other. For example, if one
// of your strings is "abc", then none of your other strings should include the
// substring "abc", like "xyabcde".

// All of your strings should have different lengths. For example, if one of
// your strings is "abc", then none of your other strings should have length 3.

export const tokenizingError1 = "a |c";
export const tokenizingError2 = "b7 &d";
export const tokenizingError3 = "e |& v";
export const tokenizingError4 = "z&&v|45";
export const tokenizingError5 = "false&true|fdalce";

// ******************
// * EXERCISE 1 END *
// ******************


// ********************
// * EXERCISE 2 START *
// ********************

// Give five different non-empty strings of source code that each have a
// parsing error **when using the standard fixity table**, but have no
// tokenizing errors. To restore the standard fixity table on the webpage, hold
// Shift and click the reload button in your browser.

// None of your strings should be substrings of each other. For example, if one
// of your strings is "abc", then none of your other strings should include the
// substring "abc", like "xyabcde".

// All of your strings should have different lengths. For example, if one of
// your strings is "abc", then none of your other strings should have length 3.

export const parsingError1 = "a ||";
export const parsingError2 = "< 454324";
export const parsingError3 = "== 132.2324";
export const parsingError4 = "&& 123.123";
export const parsingError5 = "== jasdfjasdf";

// ******************
// * EXERCISE 2 END *
// ******************


// ********************
// * EXERCISE 3 START *
// ********************

// Give five different non-empty strings of source code that each have an
// execution error **when using the standard fixity table** and **in an empty
// scope**, but have no parsing errors or tokenizing errors. To restore the
// standard fixity table on the webpage, hold Shift and click the reload button
// in your browser.

// None of your strings should be substrings of each other. For example, if one
// of your strings is "abc", then none of your other strings should include the
// substring "abc", like "xyabcde".

// All of your strings should have different lengths. For example, if one of
// your strings is "abc", then none of your other strings should have length 3.

export const executionError1 = "apple && 45";
export const executionError2 = "banana && 34.123";
export const executionError3 = "pear * 112312312313";
export const executionError4 = "fj + 123.123123";
export const executionError5 = "13.323 || 123";

// ******************
// * EXERCISE 3 END *
// ******************


// ********************
// * EXERCISE 4 START *
// ********************

// Modify the fixity table definition below so that each of the following
// expressions parses as specified. For example, with the **standard** fixity
// table, the expression "1 + 2 * 3" parses the same as "1 + (2 * 3)", because
// the parser produces the same AST for both of them.

// The code you define here will **not** change the behavior on the webpage: you
// should first experiment with the fixity table input on the webpage to find a
// table that works, and then modify this code based on your working table.

// There are multiple possible right answers that satisfy all of these
// requirements. You only need to give one table that satisfies all of the
// requirements.

// With **your modified** fixity table:
//   "1 + 2 * 3" should parse the same as "(1 + 2) * 3"
//   "3 / 4 == 5 || 6" should parse the same as "(3 / 4) == (5 || 6)"
//   "4 / 5 / 6 - 7 - 8" should parse the same as "(4 / (5 / 6)) - (7 - 8)"
//   "1 < 2 < (3 == 4) - 5 + 6" should parse the same as "1 < (2 < ((3 == 4) - (5 + 6)))"
//   "6 && 7 == 8 * 9 || 10 == 11 && 12" should parse the same as "((6 && 7) == (8 * (9 || 10))) == (11 && 12)"

export const nonstandardOrderOfOperations: FixityTable = {
  and: { precedence: 3, associativity: "left" },
  or: { precedence: 4, associativity: "left" },
  less: { precedence: 1, associativity: "right" },
  equal: { precedence: 2, associativity: "left" },
  plus: { precedence: 5, associativity: "right" },
  minus: { precedence: 3, associativity: "right" },
  times: { precedence: 3, associativity: "right" },
  divide: { precedence: 4, associativity: "right" },
};

// ******************
// * EXERCISE 4 END *
// ******************