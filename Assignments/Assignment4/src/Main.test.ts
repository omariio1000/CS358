import "jest-extended";

import { parse } from "./Main";

const compare = (actual: string, expected: string) => {
  let actualTrees = parse(actual);
  let expectedTrees = parse(expected);
  expect(actualTrees.length).toEqual(1);
  expect(expectedTrees.length).toEqual(1);
  expect(actualTrees).toEqual(expectedTrees);
}

test("order of operations tests", () => {
  compare("1 || 2 || 3", "((1 || 2) || 3)");
  compare("1 || ((2 && 3) + true - false) * 1 / 3", "(1 || ((((2 && 3) + true) - false) * (1 / 3)))");
  compare("1 + !(2 < 3) + 4 * 5 + 6 && 7 == 8 * 9 || 10 == 11 && -true || !x", "((((((1 + (! (2 < 3))) + (4 * 5)) + 6) && 7) == ((8 * 9) || 10)) == ((11 && (- true)) || (! x)))");
  compare("1 && 2 && true || false || 3 + 4 + 5 * 6 * 7 / true / false - -1 + !1 < true < false == true", "((((((1 && 2) && true) || false) || ((((3 + 4) + (5 * (6 * (7 / (true / false))))) - (- 1)) + (! 1))) < (true < false)) == true)");
});