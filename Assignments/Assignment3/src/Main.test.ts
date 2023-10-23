import "jest-extended";

import { FixityTable, tokenize } from "./Library/IO";
import {
    ParsingError, TokenizingError, ExecutionError,
    tokenizingError1, tokenizingError2, tokenizingError3, tokenizingError4, tokenizingError5,
    parsingError1, parsingError2, parsingError3, parsingError4, parsingError5,
    executionError1, executionError2, executionError3, executionError4, executionError5, execute, nonstandardOrderOfOperations,
} from "./Main";
import { parse } from "./Library/Parser";

const standardTable: FixityTable = {
    and: { precedence: 1, associativity: "left" },
    or: { precedence: 1, associativity: "left" },
    less: { precedence: 2, associativity: "left" },
    equal: { precedence: 2, associativity: "left" },
    plus: { precedence: 3, associativity: "right" },
    minus: { precedence: 3, associativity: "right" },
    times: { precedence: 4, associativity: "right" },
    divide: { precedence: 4, associativity: "right" },
};

describe("exercise 1", () => {
    test("none of the strings are empty", () => {
        expect(tokenizingError1).not.toBeEmpty();
        expect(tokenizingError2).not.toBeEmpty();
        expect(tokenizingError3).not.toBeEmpty();
        expect(tokenizingError4).not.toBeEmpty();
        expect(tokenizingError5).not.toBeEmpty();
    });

    test("none of the strings are substrings of each other", () => {
        expect(tokenizingError1).not.toInclude(tokenizingError2);
        expect(tokenizingError1).not.toInclude(tokenizingError3);
        expect(tokenizingError1).not.toInclude(tokenizingError4);
        expect(tokenizingError1).not.toInclude(tokenizingError5);
        expect(tokenizingError2).not.toInclude(tokenizingError1);
        expect(tokenizingError2).not.toInclude(tokenizingError3);
        expect(tokenizingError2).not.toInclude(tokenizingError4);
        expect(tokenizingError2).not.toInclude(tokenizingError5);
        expect(tokenizingError3).not.toInclude(tokenizingError1);
        expect(tokenizingError3).not.toInclude(tokenizingError2);
        expect(tokenizingError3).not.toInclude(tokenizingError4);
        expect(tokenizingError3).not.toInclude(tokenizingError5);
        expect(tokenizingError4).not.toInclude(tokenizingError1);
        expect(tokenizingError4).not.toInclude(tokenizingError2);
        expect(tokenizingError4).not.toInclude(tokenizingError3);
        expect(tokenizingError4).not.toInclude(tokenizingError5);
        expect(tokenizingError5).not.toInclude(tokenizingError1);
        expect(tokenizingError5).not.toInclude(tokenizingError2);
        expect(tokenizingError5).not.toInclude(tokenizingError3);
        expect(tokenizingError5).not.toInclude(tokenizingError4);
    });

    test("none of the strings have the same length", () => {
        expect(tokenizingError1.length).not.toEqual(tokenizingError2.length);
        expect(tokenizingError1.length).not.toEqual(tokenizingError3.length);
        expect(tokenizingError1.length).not.toEqual(tokenizingError4.length);
        expect(tokenizingError1.length).not.toEqual(tokenizingError5.length);
        expect(tokenizingError2.length).not.toEqual(tokenizingError1.length);
        expect(tokenizingError2.length).not.toEqual(tokenizingError3.length);
        expect(tokenizingError2.length).not.toEqual(tokenizingError4.length);
        expect(tokenizingError2.length).not.toEqual(tokenizingError5.length);
        expect(tokenizingError3.length).not.toEqual(tokenizingError1.length);
        expect(tokenizingError3.length).not.toEqual(tokenizingError2.length);
        expect(tokenizingError3.length).not.toEqual(tokenizingError4.length);
        expect(tokenizingError3.length).not.toEqual(tokenizingError5.length);
        expect(tokenizingError4.length).not.toEqual(tokenizingError1.length);
        expect(tokenizingError4.length).not.toEqual(tokenizingError2.length);
        expect(tokenizingError4.length).not.toEqual(tokenizingError3.length);
        expect(tokenizingError4.length).not.toEqual(tokenizingError5.length);
        expect(tokenizingError5.length).not.toEqual(tokenizingError1.length);
        expect(tokenizingError5.length).not.toEqual(tokenizingError2.length);
        expect(tokenizingError5.length).not.toEqual(tokenizingError3.length);
        expect(tokenizingError5.length).not.toEqual(tokenizingError4.length);
    });

    test("tokenizingError1 has a tokenizing error", () => {
        expect(() => tokenize(tokenizingError1)).toThrowError(TokenizingError);
    });

    test("tokenizingError2 has a tokenizing error", () => {
        expect(() => tokenize(tokenizingError2)).toThrowError(TokenizingError);
    });

    test("tokenizingError3 has a tokenizing error", () => {
        expect(() => tokenize(tokenizingError3)).toThrowError(TokenizingError);
    });

    test("tokenizingError4 has a tokenizing error", () => {
        expect(() => tokenize(tokenizingError4)).toThrowError(TokenizingError);
    });

    test("tokenizingError5 has a tokenizing error", () => {
        expect(() => tokenize(tokenizingError5)).toThrowError(TokenizingError);
    });
});

describe("exercise 2", () => {
    test("none of the strings are empty", () => {
        expect(parsingError1).not.toBeEmpty();
        expect(parsingError2).not.toBeEmpty();
        expect(parsingError3).not.toBeEmpty();
        expect(parsingError4).not.toBeEmpty();
        expect(parsingError5).not.toBeEmpty();
    });

    test("none of the strings are substrings of each other", () => {
        expect(parsingError1).not.toInclude(parsingError2);
        expect(parsingError1).not.toInclude(parsingError3);
        expect(parsingError1).not.toInclude(parsingError4);
        expect(parsingError1).not.toInclude(parsingError5);
        expect(parsingError2).not.toInclude(parsingError1);
        expect(parsingError2).not.toInclude(parsingError3);
        expect(parsingError2).not.toInclude(parsingError4);
        expect(parsingError2).not.toInclude(parsingError5);
        expect(parsingError3).not.toInclude(parsingError1);
        expect(parsingError3).not.toInclude(parsingError2);
        expect(parsingError3).not.toInclude(parsingError4);
        expect(parsingError3).not.toInclude(parsingError5);
        expect(parsingError4).not.toInclude(parsingError1);
        expect(parsingError4).not.toInclude(parsingError2);
        expect(parsingError4).not.toInclude(parsingError3);
        expect(parsingError4).not.toInclude(parsingError5);
        expect(parsingError5).not.toInclude(parsingError1);
        expect(parsingError5).not.toInclude(parsingError2);
        expect(parsingError5).not.toInclude(parsingError3);
        expect(parsingError5).not.toInclude(parsingError4);
    });

    test("none of the strings have the same length", () => {
        expect(parsingError1.length).not.toEqual(parsingError2.length);
        expect(parsingError1.length).not.toEqual(parsingError3.length);
        expect(parsingError1.length).not.toEqual(parsingError4.length);
        expect(parsingError1.length).not.toEqual(parsingError5.length);
        expect(parsingError2.length).not.toEqual(parsingError1.length);
        expect(parsingError2.length).not.toEqual(parsingError3.length);
        expect(parsingError2.length).not.toEqual(parsingError4.length);
        expect(parsingError2.length).not.toEqual(parsingError5.length);
        expect(parsingError3.length).not.toEqual(parsingError1.length);
        expect(parsingError3.length).not.toEqual(parsingError2.length);
        expect(parsingError3.length).not.toEqual(parsingError4.length);
        expect(parsingError3.length).not.toEqual(parsingError5.length);
        expect(parsingError4.length).not.toEqual(parsingError1.length);
        expect(parsingError4.length).not.toEqual(parsingError2.length);
        expect(parsingError4.length).not.toEqual(parsingError3.length);
        expect(parsingError4.length).not.toEqual(parsingError5.length);
        expect(parsingError5.length).not.toEqual(parsingError1.length);
        expect(parsingError5.length).not.toEqual(parsingError2.length);
        expect(parsingError5.length).not.toEqual(parsingError3.length);
        expect(parsingError5.length).not.toEqual(parsingError4.length);
    });

    test("parsingError1 has a parsing error", () => {
        expect(() => parse(standardTable, tokenize(parsingError1))).toThrowError(ParsingError);
    });

    test("parsingError2 has a parsing error", () => {
        expect(() => parse(standardTable, tokenize(parsingError2))).toThrowError(ParsingError);
    });

    test("parsingError3 has a parsing error", () => {
        expect(() => parse(standardTable, tokenize(parsingError3))).toThrowError(ParsingError);
    });

    test("parsingError4 has a parsing error", () => {
        expect(() => parse(standardTable, tokenize(parsingError4))).toThrowError(ParsingError);
    });

    test("parsingError5 has a parsing error", () => {
        expect(() => parse(standardTable, tokenize(parsingError5))).toThrowError(ParsingError);
    });
});

describe("exercise 3", () => {
    test("none of the strings are empty", () => {
        expect(executionError1).not.toBeEmpty();
        expect(executionError2).not.toBeEmpty();
        expect(executionError3).not.toBeEmpty();
        expect(executionError4).not.toBeEmpty();
        expect(executionError5).not.toBeEmpty();
    });

    test("none of the strings are substrings of each other", () => {
        expect(executionError1).not.toInclude(executionError2);
        expect(executionError1).not.toInclude(executionError3);
        expect(executionError1).not.toInclude(executionError4);
        expect(executionError1).not.toInclude(executionError5);
        expect(executionError2).not.toInclude(executionError1);
        expect(executionError2).not.toInclude(executionError3);
        expect(executionError2).not.toInclude(executionError4);
        expect(executionError2).not.toInclude(executionError5);
        expect(executionError3).not.toInclude(executionError1);
        expect(executionError3).not.toInclude(executionError2);
        expect(executionError3).not.toInclude(executionError4);
        expect(executionError3).not.toInclude(executionError5);
        expect(executionError4).not.toInclude(executionError1);
        expect(executionError4).not.toInclude(executionError2);
        expect(executionError4).not.toInclude(executionError3);
        expect(executionError4).not.toInclude(executionError5);
        expect(executionError5).not.toInclude(executionError1);
        expect(executionError5).not.toInclude(executionError2);
        expect(executionError5).not.toInclude(executionError3);
        expect(executionError5).not.toInclude(executionError4);
    });

    test("none of the strings have the same length", () => {
        expect(executionError1.length).not.toEqual(executionError2.length);
        expect(executionError1.length).not.toEqual(executionError3.length);
        expect(executionError1.length).not.toEqual(executionError4.length);
        expect(executionError1.length).not.toEqual(executionError5.length);
        expect(executionError2.length).not.toEqual(executionError1.length);
        expect(executionError2.length).not.toEqual(executionError3.length);
        expect(executionError2.length).not.toEqual(executionError4.length);
        expect(executionError2.length).not.toEqual(executionError5.length);
        expect(executionError3.length).not.toEqual(executionError1.length);
        expect(executionError3.length).not.toEqual(executionError2.length);
        expect(executionError3.length).not.toEqual(executionError4.length);
        expect(executionError3.length).not.toEqual(executionError5.length);
        expect(executionError4.length).not.toEqual(executionError1.length);
        expect(executionError4.length).not.toEqual(executionError2.length);
        expect(executionError4.length).not.toEqual(executionError3.length);
        expect(executionError4.length).not.toEqual(executionError5.length);
        expect(executionError5.length).not.toEqual(executionError1.length);
        expect(executionError5.length).not.toEqual(executionError2.length);
        expect(executionError5.length).not.toEqual(executionError3.length);
        expect(executionError5.length).not.toEqual(executionError4.length);
    });

    test("executionError1 has an execution error", () => {
        expect(() => execute(new Map, parse(standardTable, tokenize(executionError1)))).toThrowError(ExecutionError);
    });

    test("executionError2 has an execution error", () => {
        expect(() => execute(new Map, parse(standardTable, tokenize(executionError2)))).toThrowError(ExecutionError);
    });

    test("executionError3 has an execution error", () => {
        expect(() => execute(new Map, parse(standardTable, tokenize(executionError3)))).toThrowError(ExecutionError);
    });

    test("executionError4 has an execution error", () => {
        expect(() => execute(new Map, parse(standardTable, tokenize(executionError4)))).toThrowError(ExecutionError);
    });

    test("executionError5 has an execution error", () => {
        expect(() => execute(new Map, parse(standardTable, tokenize(executionError5)))).toThrowError(ExecutionError);
    });
});

describe("exercise 4", () => {
    const compare = (left: string, right: string) => expect(parse(nonstandardOrderOfOperations, tokenize(left))).toEqual(parse(nonstandardOrderOfOperations, tokenize(right)));

    test('"1 + 2 * 3" should parse the same as "(1 + 2) * 3"', () => {
        compare("1 + 2 * 3", "(1 + 2) * 3");
    });

    test('"3 / 4 == 5 || 6" should parse the same as "(3 / 4) == (5 || 6)"', () => {
        compare("3 / 4 == 5 || 6",  "(3 / 4) == (5 || 6)")
    });

    test('"4 / 5 / 6 - 7 - 8" should parse the same as "(4 / (5 / 6)) - (7 - 8)"', () => {
        compare("4 / 5 / 6 - 7 - 8",  "(4 / (5 / 6)) - (7 - 8)");
    });

    test('"1 < 2 < (3 == 4) - 5 + 6" should parse the same as "1 < (2 < ((3 == 4) - (5 + 6)))"', () => {
        compare("1 < 2 < (3 == 4) - 5 + 6",  "1 < (2 < ((3 == 4) - (5 + 6)))");
    });

    test('"6 && 7 == 8 * 9 || 10 == 11 && 12" should parse the same as "((6 && 7) == (8 * (9 || 10))) == (11 && 12)"', () => {
        compare("6 && 7 == 8 * 9 || 10 == 11 && 12",  "((6 && 7) == (8 * (9 || 10))) == (11 && 12)");
    });
});