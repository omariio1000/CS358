// READING THE TESTS WILL NOT TELL YOU HOW TO SOLVE THE PROBLEMS. That's not
// what tests are for! Tests don't tell you *how* to write your code correctly,
// they only tell you *when* your code is incorrect.

// If you're stuck on a particular test and you don't understand why, don't
// spend your time reading this file. Instead, spend your time reading the
// *explanation* and *code* in Main.ts, and *using the debugger* to figure out
// where your understanding is wrong!

import "jest-extended";

import {
  List,
  cons, snoc, doubleEachIterative, doubleEachRecursive, reverse, duplicateOnes,
  LogicTree,  
  countNodesIterative, countNodesRecursive, flipOrs, evaluate,
  countOrs, removeTrues
} from "./Main";
import {
   parseList, unparseList, parseTree, unparseTree
} from "./Library";

const wrapListList = (f: (l:List) => List) => (s:string) => unparseList(f(parseList(s)));

const dei = wrapListList(doubleEachIterative);

test("doubleEachIterative test", () => {
  expect(dei("")).toEqual("");

  expect(dei("0")).toEqual("0");

  expect(dei("1")).toEqual("2");

  expect(dei("-1, 1")).toEqual("-2, 2")

  expect(dei("-100, 100, 1, 2")).toEqual("-200, 200, 2, 4")  // spaces in the expected string matter!
});

const der = wrapListList(doubleEachRecursive);

test("doubleEachRecursive test", () => {
  expect(der("")).toEqual("");

  expect(der("0")).toEqual("0");

  expect(der("1")).toEqual("2");

  expect(der("-1, 1")).toEqual("-2, 2")

  expect(der("-100, 100, 1, 2")).toEqual("-200, 200, 2, 4")
});

const rev = wrapListList(reverse);

test("reverse test", () => {
  expect(rev("")).toEqual("");

  expect(rev("0")).toEqual("0");

  expect(rev("1")).toEqual("1");

  expect(rev("-1, 1, 0")).toEqual("0, 1, -1");

  expect(rev("-100, 100, 1, 2")).toEqual("2, 1, 100, -100");
});


const d1s = wrapListList(duplicateOnes);

test("duplicateOnes test", () => {
  expect(d1s("")).toEqual("");		      

  expect(d1s("0")).toEqual("0");

  expect(d1s("1")).toEqual("1, 1");

  expect(d1s("-1, 1, 0")).toEqual("-1, 1, 1, 0");

  expect(d1s("1, 100, 1, -2")).toEqual("1, 1, 100, 1, 1, -2");
});

const wrapTreeNum = (f: (l:LogicTree) => number) => (s:string) => f(parseTree(s));

const co = wrapTreeNum(countOrs)

test("countOrs test", () => {
  expect(co("true")).toEqual(0);

  expect(co("false")).toEqual(0);

  expect(co("!true")).toEqual(0);

  expect(co("!false")).toEqual(0);

  expect(co("!!true")).toEqual(0);

  expect(co("true || false")).toEqual(1);

  expect(co("true || (!false || true)")).toEqual(2);

  expect(co("(true || true) || (!false || true)")).toEqual(3);

  expect(co("!(true && (false || true)) || (true && ((true || false) || ((true || true) || true)))")).toEqual(6);
});

const wrapTreeTree = (f: (l:LogicTree) => LogicTree) => (s:string) => unparseTree(f(parseTree(s)));

const rt = wrapTreeTree(removeTrues);

test("removeTrues test", () => {
  expect(rt("false")).toEqual("false");

  expect(rt("true")).toEqual("!false");

  expect(rt("!false")).toEqual("!false");

  expect(rt("!true")).toEqual("!!false");

  expect(rt("!!false")).toEqual("!!false");

  expect(rt("!false || !true")).toEqual("!false || !!false");

  expect(rt("!(false && true)")).toEqual("!(false && !false)");

  expect(rt("!(!!!true || !(true || false))")).toEqual("!(!!!!false || !(!false || false))"); // spaces around || matter
});
