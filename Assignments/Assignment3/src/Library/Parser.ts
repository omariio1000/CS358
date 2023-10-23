import { AST, InfixOpNode, ParsingError } from "../Main";
import { Sort, Token, FixityTable } from "./IO";

function isBinOpSort(sort: Sort): sort is InfixOpNode["tag"] {
  return (
    sort == "plus" ||
    sort == "minus" ||
    sort == "times" ||
    sort == "divide" ||
    sort == "or" ||
    sort == "and" ||
    sort == "less" ||
    sort == "equal"
  );
}

function expect(sort: Sort, tokens: Token[]): void {
  const head = tokens.shift();
  if (head?.sort !== sort)
    throw new ParsingError("unexpected " + head!.text);
}

export function parse(table: FixityTable, tokens: Token[]): AST {
  return parseShunted(shunt(table, tokens));
}

function parseShunted(tokens: Token[]): AST {
  const head = tokens.shift();
  if (head === undefined)
    throw new ParsingError("unexpected end of input");

  switch (head.sort) {
    case "parenL": {
      const tree = parseShunted(tokens);
      expect("parenR", tokens);
      return tree;
    }
    case "parenR":
      throw new ParsingError("unexpected right parenthesis");
    case "num":
      return { tag: "num", value: parseInt(head.text) };
    case "bool":
      return { tag: "bool", value: head.text === "true" };
    case "name":
      return { tag: "name", name: head.text };
    default:
      return { tag: head.sort, leftSubtree: parseShunted(tokens), rightSubtree: parseShunted(tokens) };
  }
}

function shunt(table: FixityTable, tokens: Token[]): Token[] {
  const operators: Token[] = [];
  const output: Token[] = [];

  while (tokens.length > 0) {
    let token = tokens.pop()!;
    switch (token.sort) {
      case "num":
      case "bool":
      case "name":
        output.unshift(token);
        break;

      case "parenR":
        operators.unshift(token);
        break;

      case "parenL":
        while (true) {
          let operator = operators.shift();
          if (operator === undefined)
            throw new ParsingError("missing right parenthesis");
          else if (operator.sort == "parenR")
            break;
          else
            output.unshift(operator);
        }
        break;

      default:
        while (operators.length > 0) {
          let operator = operators[0];
          let fixity1 = table[token.sort];
          let fixity2 = isBinOpSort(operator.sort) ? table[operator.sort] : { precedence: -Infinity, associativity: "none" };
          if (fixity1.precedence == fixity2.precedence && fixity1.associativity != fixity2.associativity)
            throw new ParsingError(
              "operators " + token.text + " and " + operator.text +
              " have the same precedence but different associativity, so parentheses are required"
            );
          if (
            operator.sort == "parenL" ||
            (
              fixity2.precedence > fixity1.precedence ||
              (
                fixity2.precedence == fixity1.precedence &&
                fixity2.associativity == "right" &&
                fixity1.associativity == "right"
              )
            )
          ) {
            operators.shift();
            output.unshift(operator);
          } else
            break;
        }
        operators.unshift(token);
        break;
    }
  }

  while (operators.length > 0) {
    let operator = operators.shift()!;
    if (operator.sort == "parenL")
      throw new ParsingError("unmatched left parenthesis");
    else if (operator.sort == "parenR")
      throw new ParsingError("unmatched right parenthesis");
    else
      output.unshift(operator);
  }

  return output;
}
