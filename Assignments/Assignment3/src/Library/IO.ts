// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import {
  AST, Scope, Value, ExecutionError as RuntimeError, execute, InfixOpNode, Fixity, TokenizingError, ParsingError,
} from "../Main";
import { parse } from "./Parser";

export type FixityTable = Record<InfixOpNode["tag"], Fixity>;

export type Sort = "parenL" | "parenR" | "num" | "bool" | "name" | InfixOpNode["tag"];

export type Token = {
  sort: Sort;
  text: string;
}

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

export function run(
  and: Fixity,
  or: Fixity,
  less: Fixity,
  equal: Fixity,
  plus: Fixity,
  minus: Fixity,
  times: Fixity,
  divide: Fixity,
  scope: Scope,
  input: string
): [Token[] | TokenizingError, AST | ParsingError, Value | RuntimeError] {
  try {
    const tokens = tokenize(input);
    try {
      const tree = parse({ times, divide, and, or, plus, minus, less, equal }, [...tokens]);
      try {
        return [tokens, tree, execute(scope, tree)];
      } catch (e) {
        if (e instanceof RuntimeError)
          return [tokens, tree, e];
        else
          throw e;
      }
    } catch (e) {
      if (e instanceof ParsingError)
        return [tokens, e, new RuntimeError("couldn't execute because parsing failed")];
      else
        throw e;
    }
  } catch (e) {
    if (e instanceof TokenizingError)
      return [e, new ParsingError("couldn't parse because tokenizing failed"), new RuntimeError("couldn't execute because tokenizing failed")];
    else
      throw e;
  }
}

export function render([tokens, tree, value]: [Token[] | TokenizingError, AST | ParsingError, Value | RuntimeError]): HTMLElement {
  const topDiv = document.createElement("div");

  topDiv.appendChild(document.createElement("hr"));

  const tokensDiv = document.createElement("div");
  tokensDiv.appendChild(document.createTextNode("tokenizing output:"));
  if (tokens instanceof TokenizingError)
    tokensDiv.innerText = "tokenizing error: " + tokens.message;
  else
    tokensDiv.appendChild(prettyPrintTokenArray(tokens));
  topDiv.appendChild(tokensDiv);

  topDiv.appendChild(document.createElement("hr"));

  const treeDiv = document.createElement("div");
  treeDiv.appendChild(document.createTextNode("parsing output:"));
  if (tree instanceof ParsingError)
    treeDiv.innerText = "parsing error: " + tree.message;
  else
    treeDiv.appendChild(prettyPrintTree(tree));
  topDiv.appendChild(treeDiv);

  topDiv.appendChild(document.createElement("hr"));

  const valueDiv = document.createElement("div");
  if (value instanceof RuntimeError)
    valueDiv.appendChild(document.createTextNode("execution error: " + value.message));
  else
    valueDiv.appendChild(document.createTextNode("execution output: " + value.value.toString()));
  topDiv.appendChild(valueDiv);

  return topDiv;
}

export function readFixity(input: string): Fixity {
  const parts = input.split(/\s+/);
  if (!/\d+(?:\.\d+)?/.test(parts[0]))
    throw new Error("invalid precedence: " + parts[0]);
  if (parts[1] !== "left" && parts[1] !== "right")
    throw new Error("invalid associativity: " + parts[1]);
  return {
    precedence: parseFloat(parts[0]),
    associativity: parts[1]
  }
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

export const readValue = (input: string): Value => {
  if (/true|false/.test(input))
    return { tag: "bool", value: input == "true" };
  else if (/\d+(?:\.\d+)?/.test(input))
    return { tag: "num", value: parseFloat(input)};
  else
    throw new Error("invalid Boolean: " + input);
}

const lexicon: [string, Sort][] = [
  ["\\+", "plus"],
  ["\\-", "minus"],
  ["\\*", "times"],
  ["\\/", "divide"],
  ["<", "less"],
  ["==", "equal"],
  ["\\|\\|", "or"],
  ["&&", "and"],
  ["true|false", "bool"],
  ["\\d+(?:\\.\\d+)?", "num"],
  ["[A-Za-z]\\w*", "name"],
  ["\\(", "parenL"],
  ["\\)", "parenR"],
];

export const tokenize = (source: string): Token[] => {
  const lexemes: Token[] = [];
  source.trimEnd();
  while (source != "") {
    source = source.trimStart();
    let matched = false;
    for (const [lexeme, sort] of lexicon) {
      const match = source.match(RegExp("^(" + lexeme + ")"));
      if (match && match[0]) {
        source = source.substring(match[0].length)
        lexemes.push({ sort, text: match[0] });
        matched = true;
        break;
      }
    }
    if (!matched)
      throw new TokenizingError(source)
  }
  return lexemes;
}

export const readScope = (input: string): Scope => {
  const bindings = input.trim().split(/\s*,\s*/).filter(x => x);
  return new Map(
    bindings.map(binding => {
      const tokens = binding.trim().split(/\s*=\s*/);
      if (tokens.length != 2 || !/[A-Za-z]\w*/.test(tokens[0]))
        throw new Error("invalid binding: " + binding);
      return [tokens[0], readValue(tokens[1])];
    })
  );
}

export const prettyPrintTokenArray = (tokens: Token[]): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "token-array";
  for (const token of tokens)
    rootElement.appendChild(prettyPrintToken(token));
  return rootElement
}

export const prettyPrintToken = (token: Token): HTMLElement => {
  const tokenTable = document.createElement("table");
  tokenTable.className = "token-table";

  const headerRow = tokenTable.appendChild(document.createElement("tr"));
  const typeHeader = headerRow.appendChild(document.createElement("th"));
  typeHeader.innerText = "sort";
  const textHeader = headerRow.appendChild(document.createElement("th"));
  textHeader.innerText = "text";

  const tokenRow = tokenTable.appendChild(document.createElement("tr"));
  const typeCell = tokenRow.appendChild(document.createElement("td"));
  typeCell.innerText = token.sort;
  const nameCell = tokenRow.appendChild(document.createElement("td"));
  nameCell.innerText = token.text;

  return tokenTable;
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
    valHeader.innerText = val.value.toString();
  }

  return table;
}

export const unparseOp = (op: InfixOpNode["tag"]): string => {
  switch (op) {
    case "plus": return "+";
    case "minus": return "-";
    case "times": return "*";
    case "divide": return "/";
    case "and": return "&&";
    case "or": return "||";
    case "less": return "<";
    case "equal": return "==";
  }
}

export const unparseTree = (tree: AST): string => {
  switch (tree.tag) {
    case "bool":
    case "num":
      return tree.value.toString()
    case "name":
      return tree.name;
    default:
      return (
        "(" + unparseTree(tree.leftSubtree) +
        " " + unparseOp(tree.tag) + " " +
        unparseTree(tree.rightSubtree) + ")"
      );
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

export const prettyPrintNode = (tree: AST | number | boolean | string): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (typeof tree) {
    case "number":
    case "boolean":
    case "string":
      rootElement.setAttribute("data-name", tree.toString());
      break;
    default:
      switch (tree.tag) {
        case "bool":
        case "num":
          rootElement.setAttribute("data-name", tree.tag);
          rootElement.appendChild(prettyPrintNode(tree.value));
          break;
        case "name":
          rootElement.setAttribute("data-name", "name");
          rootElement.appendChild(prettyPrintNode(tree.name));
          break;
        default:
          rootElement.setAttribute("data-name", tree.tag);
          rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
          rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
          break;
      }
  }
  return rootElement;
}
