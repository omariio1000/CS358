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

// ==    1 left
// <     2 right
// ||    3 left
// &&    4 left
// +     5 left
// -     5 left
// *     6 right
// /     6 right

// expression1 -> expression1 %equal expression2
//   {% buildInfixOpNode("equal") %}

// # For the "passthrough" rules that just generate a single nonterminal, Nearley
// # provides a built-in "no-op" postprocessing function called id.
// expression1 -> expression2
//   {% id %}


// expression2 -> expression3 %less expression2
//   {% buildInfixOpNode("less") %}

// expression2 -> expression3
//   {% id %}


// expression3 -> expression3 %or expression4
//   {% buildInfixOpNode("or") %}

// expression3 -> expression4
//   {% id %}


// expression4 -> expression4 %and expression5
//   {% buildInfixOpNode("and") %}

// expression4 -> expression5
//   {% id %}


// expression5 -> expression5 %plus expression6
//   {% buildInfixOpNode("plus") %}

// expression5 -> expression5 %dash expression6
//   {% buildInfixOpNode("minus") %}

// expression5 -> expression6
//   {% id %}


// expression6 -> expression7 %times expression6
//   {% buildInfixOpNode("times") %}

// expression6 -> expression7 %divide expression6
//   {% buildInfixOpNode("divide") %}

// expression6 -> expression7
//   {% id %}


// expression7 -> atom {% id %}

// expression7 -> %dash expression7
//   {% buildPrefixOpNode("negate") %}

// expression7 -> %not expression7
//   {% buildPrefixOpNode("not") %}


// atom -> %parenL expression1 %parenR
//   {% unparenthesize %}

// atom -> %float
//   {% buildNumLeaf %}

// atom -> %bool
//   {% buildBoolLeaf %}

// atom -> %name
//   {% buildNameLeaf %}

//List
type List = null | ConsCell;
type ConsCell = {
    readonly first: number; 
    readonly rest: List;
}
function cons(newFirst: number, list: List): List {
    return {
        first: newFirst,
        rest: list
    };
}
function snoc(newLast: number, list: List): List {
    if (list == null) {
      return {
          first: newLast,
          rest: null
      };
    } else {
      const newRest: List = snoc(newLast, list.rest);
      return {
          first: list.first,
          rest: newRest
      };
    }
}
function doubleEachIterative(list: List): List {
    let output: List = null;
    for (let cur: List = list; cur != null; cur = cur.rest) {
      output = snoc(cur.first * 2, output);
    }
  
    return output;
}
function doubleEachRecursive(list: List): List {
    if (list == null) {
      return list;
    } else {
      const doubledRest = doubleEachRecursive(list.rest);
      return cons(list.first * 2, doubledRest);
    }
}
function reverse(list: List): List {
    if (list == null || list.rest == null) return list;
    else {
      const newFirst: List = reverse(list.rest);
      return snoc(list.first, newFirst);
    }
}
function duplicateOnes(list: List): List {
    if (list == null) return list;
    else {
      const newRest: List = duplicateOnes(list.rest);
      if(list.first == 1) {
        return cons(list.first, cons(1, newRest));
      }
      return cons(list.first, newRest);
    }
}
//Tree
type LogicTree = OrNode | AndNode | NotNode | BoolLeaf;
type OrNode = {
  readonly tag: "or";
  readonly leftSubtree: LogicTree;
  readonly rightSubtree: LogicTree;
}
type AndNode = {
  readonly tag: "and";
  readonly leftSubtree: LogicTree;
  readonly rightSubtree: LogicTree;
}
type NotNode = {
  readonly tag: "not";
  readonly subtree: LogicTree;
}
type BoolLeaf = {
  readonly tag: "bool";
  readonly value: boolean;
}
function sampleTree(): LogicTree {
    const tree1: LogicTree = { tag: "bool", value: true };
    const tree2: LogicTree = {
      tag: "not",
      subtree: tree1
    };
    const tree3: LogicTree = {
      tag: "or",
      leftSubtree: tree1,
      rightSubtree: tree2
    };
    return tree3;
}
function countNodesIterative(tree: LogicTree): number {
    let stack: LogicTree[] = [tree];
    let nodeCount = 0;
    let top = stack.pop();
    while (top != null) {
      nodeCount++;
      switch (top.tag) {
        case "or":
        case "and":
          stack.push(top.rightSubtree);
          stack.push(top.leftSubtree);
          break;
        case "not":
          stack.push(top.subtree);
          break;
        case "bool":
          break;
      }
      top = stack.pop();
    }
    return nodeCount;
}
function countNodesRecursive(tree: LogicTree): number {
    let nodeCount: number = 1;
    switch (tree.tag) {
      case "or":
      case "and": 
        nodeCount += countNodesRecursive(tree.leftSubtree); 
        nodeCount += countNodesRecursive(tree.rightSubtree);
        break;
      case "not":
        nodeCount += countNodesRecursive(tree.subtree);
        break;
      case "bool":
        break;
    }
    return nodeCount;
}
function flipOrs(tree: LogicTree): LogicTree {
    switch (tree.tag) {
      case "or":
        return {
          tag: "or",
          leftSubtree: flipOrs(tree.rightSubtree),
          rightSubtree: flipOrs(tree.leftSubtree)
        };
      case "and":
        return {
          tag: "and",
          leftSubtree: flipOrs(tree.leftSubtree),
          rightSubtree: flipOrs(tree.rightSubtree)
        };
      case "not":
        return {
          tag: "not",
          subtree: flipOrs(tree.subtree)
        };
      case "bool":
        return tree;
    }
}
function evaluate(tree: LogicTree): boolean {
    switch (tree.tag) {
      case "or":
        return (
          evaluate(tree.leftSubtree) ||
          evaluate(tree.rightSubtree)
        );
      case "and":
        return (
          evaluate(tree.leftSubtree) &&
          evaluate(tree.rightSubtree)
        )
      case "not":
        return ! evaluate(tree.subtree);
      case "bool":
        return tree.value;
    }
}
function countOrs(tree: LogicTree): number {
    let orCount: number = 0;
    if (tree.tag == "or")  orCount = 1;
    switch (tree.tag) {
      case "or":
      case "and":
        orCount += countOrs(tree.leftSubtree);
        orCount += countOrs(tree.rightSubtree);
        break;
      case "not":
        orCount += countOrs(tree.subtree);
        break;
      case "bool":
        break;
    }
    return orCount; 
}
function removeTrues(tree: LogicTree): LogicTree {
    switch (tree.tag) {
      case "or":
        return {
          tag: "or",
          leftSubtree: removeTrues(tree.leftSubtree),
          rightSubtree: removeTrues(tree.rightSubtree)
        };
      case "and":
        return {
          tag: "and",
          leftSubtree: removeTrues(tree.leftSubtree),
          rightSubtree: removeTrues(tree.rightSubtree)
        };
      case "not":
        return {
          tag: "not",
          subtree: removeTrues(tree.subtree)
        };
      case "bool":
        if (tree.value == false) return tree;
        else {
          return {
            tag: "not",
            subtree: {
              tag: "bool",
              value: false
            }
          };
        }
    }
}