// You"re not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import {
  List, listToString, snoc,
  LogicTree
} from "./Main";

export const identity = <A> (x: A) => x;

export type Parsers<Ts> = {
  [i in keyof Ts]: (input: string) => Ts[i];
}


export const chainVoid =
  <Ts extends any[], T> (
    f: (...args: [...Ts, T]) => void
  ) => (
    ...args: [...Ts, T]
  ): T => {
    f(...args);
    return args[args.length - 1];
  }

export const parseNum = (input: string): number => {
  if (!/^-?(?:(?:\d+(?:\.\d*)?)|\.\d+)$/.test(input))
    throw new Error("invalid number: " + input);
  return Number.parseFloat(input);
}

export const parseList = (input: string): List => {
  // let list = nil();
  input = input.trim();
  return input == ""
    ? null
    : input.split(/\s*,\s*/).reduce<List>((list, token) => snoc(parseNum(token), list), null);
}

export const parseTree = (source: string) /* : LogicTree | null */ => {
  const tokens = tokenize(source);
  if (tokens == null) throw new Error("invalid Boolean logic expression")
    // Array.from(
    //   source.trim().matchAll(/(true|false)|[\w\(\)\+-]/g),
    //   (match, _) => match[0]!);
  const parse = parseNode(tokens);
  if (parse == null) throw new Error("invalid Boolean logic expression")
  const [tree, tail] = parse;
  if (tail.length != 0) throw new Error("invalid Boolean logic expression")
  return tree;
}

const lexicon = [
  "!", "||", "&&", "true", "false", "(", ")"
];

const tokenize = (source: string): string[] | null => {
  const lexemes: string[] = [];
  source.trimEnd();
  while (source != "") {
    source = source.trimStart();
    let matched = false;
    for (const lexeme of lexicon)
      if (source.startsWith(lexeme)) {
        source = source.substring(lexeme.length);
        lexemes.push(lexeme);
        matched = true;
        break;
      }
    if (!matched)
      return null;
  }
  return lexemes;
}

type Parser<T> = (tokens: string[]) => [T, string[]] | null;

const parseNode: Parser<LogicTree> = tokens =>
  parseSum(tokens);

const parseAtom: Parser<LogicTree> = tokens =>
  parseBool(tokens) ?? parseParens(tokens);

const parseParens: Parser<LogicTree> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "(") return null;
  const parse = parseNode(tail);
  if (parse == null) return null;
  const [tree, [head2, ...tail2]] = parse;
  if (head2 !== ")") return null;
  return [tree, tail2];
}

const parseBool: Parser<LogicTree> = tokens => {
  const [head, ...tail] = tokens;
  switch (head) {
    case "true": return [{ tag: "bool", value: true }, tail];
    case "false": return [{ tag: "bool", value: false }, tail];
    default: return null;
  }
}

const parseTerm: Parser<LogicTree> = tokens => {
  const [head, ...tail] = tokens;
  if (head == "!") { 
    const parse1 = parseTerm(tail);
    if (parse1 == null) return null;
    const [tree1, tail1] = parse1;
    return [{ tag: "not", subtree: tree1 }, tail1] }
  else {
    return parseAtom(tokens)
  }
}

const parseProd: Parser<LogicTree> = tokens => {
  let parse = parseTerm(tokens);
  if (parse == null) return null;
  let [tree, rest] = parse;
  while (rest.length > 0 && rest[0]== "&&") {
    const parse1 = parseTerm(rest.slice(1))
    if (parse1 == null) return null;
    const [tree1,rest1] = parse1;
    tree = {tag: "and", leftSubtree:tree, rightSubtree: tree1}
    rest = rest1
  }
  return [tree,rest];
}

const parseSum: Parser<LogicTree> = tokens => {
  let parse = parseProd(tokens);
  if (parse == null) return null;
  let [tree, rest] = parse;
  while (rest.length > 0 && rest[0] == "||") {
    const parse1 = parseProd(rest.slice(1))
    if (parse1 == null) return null;
    const [tree1,rest1]  = parse1;
    tree = {tag: "or", leftSubtree:tree, rightSubtree: tree1}
    rest = rest1
  }
  return [tree,rest];
}


export const unparseList = listToString


export const unparseTree = (tree: LogicTree, nested :boolean = false): string => {
  switch (tree.tag) {
    case "or": {
      let s = unparseTree(tree.leftSubtree,true) + " || " + unparseTree(tree.rightSubtree,true);
      return nested? "(" + s + ")" : s
    }
    case "and": {
     let s = unparseTree(tree.leftSubtree,true) + " && " + unparseTree(tree.rightSubtree,true);
     return nested? "(" + s + ")" : s
    } 
    case "not": 
      return  "!" + unparseTree(tree.subtree,true);
    case "bool":
      return Boolean(tree.value).toString()
  }
}

