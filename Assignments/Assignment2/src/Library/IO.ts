// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import {
  AST, OrNode, NotNode, BoolLeaf, NameLeaf, Scope,
  lookup, interpret, astToString,
  countNameOccurrences, substituteAllNames, removeDoubleNegations
} from "../Main";

export const toggleColorScheme = (darkMode: boolean): void => {
  const darkmode = <HTMLLinkElement> document.getElementById("darkmode");
  darkmode.disabled = !darkMode;
}

window.onload = () => {
  const toggle = <HTMLInputElement> document.getElementById("toggle-colorscheme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    toggle.checked = true;
  toggleColorScheme(toggle.checked);
}

export const identity = <A> (x: A) => x;

export type Parsers<Ts> = {
  [i in keyof Ts]: (input: string) => Ts[i];
}

export const handleForm =
  <Ts extends any[], T> (
    form: HTMLFormElement,
    parsers: Parsers<Ts>,
    prettyPrinter: (output: T) => HTMLElement,
    handle: (...inputs: Ts) => T
  ): void => {
  const output = form.querySelector(".output")!;
  try {
    const inputValues = <Ts> Array.from(
      <NodeListOf<HTMLInputElement>> form.querySelectorAll("input[type=text]"),
      (input, i) => parsers[i](input.value)
    );
    output.innerHTML = prettyPrinter(handle(...inputValues)).outerHTML;
  } catch (e) {
    if (e instanceof Error)
      output.innerHTML = "Uncaught exception: " + e.message;
  }
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

export const readBool = (input: string): boolean => {
  if (!/^(?:true|false)$/.test(input))
    throw new Error("invalid Boolean: " + input);
  return input == "true";
}

export const readTree = (source: string): AST => {
  const tokens = tokenize(source);
  if (tokens == null) throw new Error("invalid Boolean expression")
  const parse = parseTree(tokens);
  if (parse == null) throw new Error("invalid Boolean expression")
  const [tree, tail] = parse;
  if (tail.length != 0) throw new Error("invalid Boolean expression")
  return tree;
}

export const readScope = (source: string): Scope => {
  const tokens = tokenize(source);
  if (tokens == null) throw new Error("invalid scope")
  const parse = parseScope(tokens);
  if (parse == null) throw new Error("invalid scope")
  const [tree, tail] = parse;
  if (tail.length != 0) throw new Error("invalid scope")
  return tree;
}

const lexicon = [
  "!", "\\|\\|", "true", "false", "[A-Za-z]\\w*",
  "\\(", "\\)", ",", "="
];

export const tokenize = (source: string): string[] | null => {
  const lexemes: string[] = [];
  source.trimEnd();
  while (source != "") {
    source = source.trimStart();
    let matched = false;
    for (const lexeme of lexicon) {
      const match = source.match(RegExp("^(" + lexeme + ")"));
      if (match && match[0]) {
        source = source.substring(match[0].length)
        lexemes.push(match[0]);
        matched = true;
        break;
      }
    }
    if (!matched)
      return null;
  }
  return lexemes;
}

type Parser<T> = (tokens: string[]) => [T, string[]] | null;

export const parseScope: Parser<Scope> = tokens => {
  if (tokens.length == 0)
    return [new Map, tokens];
  else {
    const nameParse = parseName(tokens);
    if (nameParse == null) return null;
    const [nameLeaf, [equal, valStr, ...tail1]] = nameParse;
    if (equal != "=") return null;
    const val = readBool(valStr);
    if (tail1[0] == ",") {
      const restParse = parseScope(tail1.slice(1));
      if (restParse == null) return null;
      const [rest, tail2] = restParse;
      if (rest.has(nameLeaf.name))
        return [rest, tail2];
      else
        return [new Map([[nameLeaf.name, val], ...rest]), tail2];
    } else
      return [new Map([[nameLeaf.name, val]]), tail1];
  }
}

const parseName: Parser<NameLeaf> = tokens => {
  const [head, ...tail] = tokens;
  if (head && /[A-Za-z]\w*/.test(head))
    return [{ tag: "name", name: head }, tail];
  else
    return null;
}

const parseTree: Parser<AST> = tokens =>
  parseOr(tokens) ?? parseNot(tokens) ?? parseAtom(tokens);

const parseAtom: Parser<AST> = tokens =>
  parseBool(tokens) ?? parseName(tokens) ?? parseParens(tokens);

const parseParens: Parser<AST> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "(") return null;
  const parse = parseTree(tail);
  if (parse == null) return null;
  const [tree, [head2, ...tail2]] = parse;
  if (head2 !== ")") return null;
  return [tree, tail2];
}

const parseBool: Parser<BoolLeaf> = tokens => {
  const [head, ...tail] = tokens;
  if (head == null) return null;
  const val = head == "true" ? true : head == "false" ? false : null
  if (val == null) return null;
  return [{ tag: "bool", value: val }, tail];
}

const parseNot: Parser<NotNode> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "!") return null;
  const parse = parseNot(tail) ?? parseAtom(tail);
  if (parse == null) return null;
  const [tree, tail2] = parse;
  return [{ tag: "not", subtree: tree }, tail2];
}

const parseOr: Parser<OrNode> = tokens => {
  const parse1 = parseNot(tokens) ?? parseAtom(tokens);
  if (parse1 == null) return null;
  const [tree1, [head, ...tail1]] = parse1;
  if (head != "||") return null;
  const parse2 = parseOr(tail1) ?? parseNot(tail1) ?? parseAtom(tail1);
  if (parse2 == null) return null;
  const [tree2, tail2] = parse2;
  return [{ tag: "or", leftSubtree: tree1, rightSubtree: tree2 }, tail2];
}

export const prettyPrintObject = (obj: object): HTMLElement => {
  const numElement = document.createElement("span");
  numElement.innerText = obj.toString();
  return numElement;
}

export const prettyPrintScope = (scope: Scope): HTMLElement => {
  const table = document.createElement("table");
  table.className = "scope";

  const headerRow = table.appendChild(document.createElement("tr"));
  const nameHeader = headerRow.appendChild(document.createElement("th"));
  nameHeader.innerText = "Name";
  const valHeader = headerRow.appendChild(document.createElement("th"));
  valHeader.innerText = "Value";

  for (const [name, val] of scope.entries()) {
    const row = table.appendChild(document.createElement("tr"));
    const nameHeader = row.appendChild(document.createElement("td"));
    nameHeader.innerText = name;
    const valHeader = row.appendChild(document.createElement("td"));
    valHeader.innerText = val.toString();
  }

  return table;
}

export const unparseTree = (tree: AST): string => {
  switch (tree.tag) {
    case "or":
      return (
        (
          tree.leftSubtree.tag == "or"
            ? "(" + unparseTree(tree.leftSubtree) + ")"
            : unparseTree(tree.leftSubtree)
        ) +
        " || " +
        unparseTree(tree.rightSubtree)
      );
    case "not":
      return (
        "!" +
        (
          tree.subtree.tag == "or"
            ? "(" + unparseTree(tree.subtree) + ")"
            : unparseTree(tree.subtree)
        )
      );
    case "bool":
      return tree.value.toString()
    case "name":
      return tree.name;
  }
}

export const prettyPrintTree = (tree: AST): HTMLElement => {
  const containerElement = document.createElement("div");

  const unparseElement = document.createElement("p");
  unparseElement.innerText = unparseTree(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return containerElement;
};

export const prettyPrintNode = (tree: AST): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "or":
      rootElement.setAttribute("data-name", "or");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "not":
      rootElement.setAttribute("data-name", "not");
      rootElement.appendChild(prettyPrintNode(tree.subtree));
      break;
    case "bool":
      rootElement.setAttribute("data-name", tree.value.toString());
      break;
    case "name":
      rootElement.setAttribute("data-name", tree.name);
      break;
  }
  return rootElement;
}
