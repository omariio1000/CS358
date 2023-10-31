// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import { Token } from "moo";
import { tokenize } from "../Grammar/Tokenizer";
import { AST, Scope, Value } from "../AST";
import { parse } from "../Main";
import { ExecutionError, execute } from "../Execution";

export const identity = <A> (x: A) => x;

export type Parsers<Ts> = {
  [i in keyof Ts]: (input: string) => Ts[i];
}

window.onload = () => {
  const toggle = <HTMLInputElement> document.getElementById("toggle-colorscheme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    toggle.checked = true;
  toggleColorScheme(toggle.checked);
}

class ParsingError extends Error { }
class TokenizingError extends Error { }

class NoParseError extends ParsingError { }
class AmbiguousParseError extends ParsingError { }

export function run(
  scope: Scope,
  source: string
): [Token[] | TokenizingError, AST[], ParsingError | null, Value | ExecutionError] {
  try {
    const tokens = tokenize(source);
    try {
      const trees = parse(source);
      if (trees.length == 0)
        return [tokens, trees, new NoParseError, new ExecutionError("couldn't execute because parsing failed")];
      else if (trees.length > 1)
        return [tokens, trees, new AmbiguousParseError, new ExecutionError("couldn't execute because parsing failed")];
      else
        try {
          return [tokens, trees, null, execute(scope, trees[0])];
        } catch (e) {
          if (e instanceof ExecutionError)
            return [tokens, trees, null, e];
          else
            throw e;
        }
    } catch (e) {
      if (e instanceof Error)
        return [tokens, [], new ParsingError(e.message), new ExecutionError("couldn't execute because parsing failed")];
      else
        throw e
    }
  } catch (e) {
    if (e instanceof Error)
      return [new TokenizingError(e.message), [], new ParsingError("couldn't parse because tokenizing failed"), new ExecutionError("couldn't execute because tokenizing failed")];
    else
      throw e;
  }
}

export function render([tokens, trees, ambiguity, value]: [Token[] | TokenizingError, AST[], ParsingError | null, Value | ExecutionError]): HTMLElement {
  const topDiv = document.createElement("div");

  topDiv.appendChild(document.createElement("hr"));

  const tokensDiv = document.createElement("div");
  const treesDiv = document.createElement("div");
  tokensDiv.appendChild(document.createTextNode("tokenizing output:"));
  treesDiv.appendChild(document.createTextNode("parsing output:"));
  if (tokens instanceof TokenizingError) {
    tokensDiv.innerText = "tokenizing error: " + tokens.message;
    treesDiv.innerText = "parsing error: couldn't parse because tokenizing failed";
  } else {
    tokensDiv.appendChild(prettyPrintTokenArray(tokens));
    treesDiv.appendChild(prettyPrintTreeArray(trees));
  }
  topDiv.appendChild(tokensDiv);
  topDiv.appendChild(document.createElement("hr"));
  topDiv.appendChild(treesDiv);

  if (ambiguity instanceof ParsingError) {
    const ambiguityDiv = document.createElement("div");
    if (ambiguity instanceof NoParseError)
      ambiguityDiv.innerText = "parsing error: no valid parse trees";
    else if (ambiguity instanceof AmbiguousParseError)
      ambiguityDiv.innerText = "parsing error: too many valid parse trees";
    else
      ambiguityDiv.innerText = "parsing error: " + ambiguity.message;
    topDiv.appendChild(ambiguityDiv);
  }

  topDiv.appendChild(document.createElement("hr"));

  const valueDiv = document.createElement("div");
  if (value instanceof ExecutionError)
    valueDiv.appendChild(document.createTextNode("execution error: " + value.message));
  else
    valueDiv.appendChild(document.createTextNode("execution output: " + value.value.toString()));
  topDiv.appendChild(valueDiv);

  return topDiv;
}

export const toggleColorScheme = (darkMode: boolean): void => {
  const darkmode = <HTMLLinkElement> document.getElementById("darkmode");
  darkmode.disabled = !darkMode;
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

export const curry =
  <S, Ts extends any[], T> (
    f: (first: S, ...rest: Ts) => T
  ) => (
    first: S
  ) => (
    ...rest: Ts
  ): T =>
    f(first, ...rest);

export const chainVoid =
  <Ts extends any[], T> (
    f: (...args: [...Ts, T]) => void
  ) => (
    ...args: [...Ts, T]
  ): T => {
    f(...args);
    return args[args.length - 1];
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

export const readValue = (input: string): Value => {
  if (/true|false/.test(input))
    return { tag: "bool", value: input == "true" };
  else if (/\d+(?:\.\d+)?/.test(input))
    return { tag: "num", value: parseFloat(input)};
  else
    throw new Error("invalid Boolean: " + input);
}

export const readNum = (input: string): number => {
  if (!/^-?(?:(?:\d+(?:\.\d*)?)|\.\d+)$/.test(input))
    throw new Error("invalid number: " + input);
  return Number.parseFloat(input);
}

export const readString = (input: string): string => {
  if (!/^"[^"]*"$/.test(input))
    throw new Error("invalid string: " + input);
  return input.slice(1, -1);
}

export const prettyPrintObject = (obj: object): HTMLElement => {
  const numElement = document.createElement("span");
  numElement.innerText = obj.toString();
  return numElement;
}

export const prettyPrintToken = (token: Token): HTMLElement => {
  const tokenTable = document.createElement("table");
  tokenTable.className = "token-table";

  const headerRow = tokenTable.appendChild(document.createElement("tr"));
  const typeHeader = headerRow.appendChild(document.createElement("th"));
  typeHeader.innerText = "type";
  const textHeader = headerRow.appendChild(document.createElement("th"));
  textHeader.innerText = "text";

  const tokenRow = tokenTable.appendChild(document.createElement("tr"));
  const typeCell = tokenRow.appendChild(document.createElement("td"));
  typeCell.innerText = token.type!;
  const nameCell = tokenRow.appendChild(document.createElement("td"));
  nameCell.innerText = token.text;

  return tokenTable;
}

export const prettyPrintTokenArray = (tokens: Token[]): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "token-array";
  for (const token of tokens)
    rootElement.appendChild(prettyPrintToken(token));
  return rootElement
}

export const prettyPrintScope = (scope: Scope): HTMLElement => {
  const table = document.createElement("table");
  table.className = "scope";

  const headerRow = table.appendChild(document.createElement("tr"));
  const nameHeader = headerRow.appendChild(document.createElement("th"));
  nameHeader.innerText = "name";
  const valHeader = headerRow.appendChild(document.createElement("th"));
  valHeader.innerText = "value";

  for (const [name, val] of scope.entries()) {
    const row = table.appendChild(document.createElement("tr"));
    const nameCell = row.appendChild(document.createElement("td"));
    nameCell.innerText = name;
    const valCell = row.appendChild(document.createElement("td"));
    valCell.innerText = val.toString();
  }

  return table;
}

export const prettyPrintTree = (tree: AST): HTMLElement => {
  const containerElement = document.createElement("div");

  const unparseElement = document.createElement("p");
  unparseElement.innerText = treeToString(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return containerElement;
};

export const prettyPrintNode = (tree: AST): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "plus":
      rootElement.setAttribute("data-name", "plus");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "minus":
      rootElement.setAttribute("data-name", "minus");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "times":
      rootElement.setAttribute("data-name", "times");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "divide":
      rootElement.setAttribute("data-name", "divide");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "exponent":
      rootElement.setAttribute("data-name", "exponent");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "and":
      rootElement.setAttribute("data-name", "and");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "or":
      rootElement.setAttribute("data-name", "or");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "equal":
      rootElement.setAttribute("data-name", "equal");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "less":
      rootElement.setAttribute("data-name", "less");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "not":
      rootElement.setAttribute("data-name", "not");
      rootElement.appendChild(prettyPrintNode(tree.subtree));
      break;
    case "negate":
      rootElement.setAttribute("data-name", "negate");
      rootElement.appendChild(prettyPrintNode(tree.subtree));
      break;
    case "num":
      rootElement.setAttribute("data-name", tree.value.toString());
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

export const prettyPrintTreeArray = (trees: AST[]): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "ast-array";
  for (const tree of trees)
    rootElement.appendChild(prettyPrintTree(tree));
  return rootElement;
}

function treeToString(tree: AST): string {
  switch (tree.tag) {
    case "plus":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " + " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "minus":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " - " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "times":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " * " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "divide":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " / " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "exponent":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " ^ " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "equal":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " == " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "or":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " || " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "and":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " && " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "less":
      return (
        "(" + treeToString(tree.leftSubtree) +
        " < " + treeToString(tree.rightSubtree) +
        ")"
      );

    case "not":
      return "(! " + treeToString(tree.subtree) + ")";

    case "negate":
      return "(- " + treeToString(tree.subtree) + ")";

    case "num":
    case "bool":
      return tree.value.toString();

    case "name":
      return tree.name;
  }
}