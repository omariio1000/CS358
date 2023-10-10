//List
type List = null | ConsCell;
type ConsCell = {
    readonly first: number; 
    readonly rest: List;
}
function sampleList(): List {
    let list1: List = null;
    list1 = { first: 6, rest: list1 };
    const list2: List = { first: 5, rest: list1 };
    const list3: List = {
      first: 4,
      rest: {
        first: 3,
        rest: {
          first: 2,
          rest: list2
        }
      }
    };
    return { first: 1, rest: list3 };
};
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