import "jest-extended";
import { parse } from "./SyntaxAnalysis";
import { executeProgram } from "./Execution/Program";
import { typecheckProgram } from "./StaticAnalysis/Program";
import { ScopeError } from "./Scope";

test("exercise 1", () => {
  const prog1 = parse(`
    num main() { return example(1); }
    num example(num arg1) {
      declare arg1 = true;
      declare arg2 = true;
      {
        declare arg1 = true;
        declare arg2 = true;
      }
      return 0;
    }
  `);

  const prog2 = parse(`
    num main() {
      declare x = 1;
      declare x = 1;
      return 0;
    }
  `);

  const prog3 = parse(`
    num main() { declare p = a(1); declare q = b(); return 0; }
    num a(num x) { declare y = 1; return y; }
    num b() { declare z = x; return 0; }
  `);

  const prog4 = parse(`
    num main() { declare p = a(1); declare q = b(); return 0; }
    num a(num x) { declare y = 1; return y; }
    num b() { declare z = y; return 0; }
  `);

  expect(() => typecheckProgram(prog1)).not.toThrow();
  expect(executeProgram(prog1)).toEqual(0);

  expect(() => typecheckProgram(prog2)).toThrow(ScopeError);
  expect(() => executeProgram(prog2)).toThrow(ScopeError);

  expect(() => typecheckProgram(prog3)).toThrow(ScopeError);
  expect(() => executeProgram(prog3)).toThrow(ScopeError);

  expect(() => typecheckProgram(prog4)).toThrow(ScopeError);
  expect(() => executeProgram(prog4)).toThrow(ScopeError);
});

test("exercise 2", () => {
  const prog1 = parse(`
    num main() { return compose(f)(); }
    num f() { return 1; }
  `);

  const prog2 = parse(`
    num main() { return compose(f)(); }
    bool f() { return true; }
  `);

  const prog3 = parse(`
    num main() { return compose(f)(1); }
    num f() { return 1; }
  `);

  const prog4 = parse(`
    num main() { return compose(f, g, h)(1, a(2), 3 * 4); }
    bool f(num x, bool y, num z) { declare w = 0; if (y) w = x; else w = z; return 0 < w; }
    num g(bool x) { declare w = 0; if (x) w = 1; else w = 0; return w; }
    num h(num x) { return x * 2; }
    bool a(num x) { return x < 0; }
  `);

  expect(() => typecheckProgram(prog1)).not.toThrow();
  expect(executeProgram(prog1)).toEqual(1);

  expect(() => typecheckProgram(prog2)).toThrow();

  expect(() => typecheckProgram(prog3)).toThrow();

  expect(() => typecheckProgram(prog4)).not.toThrow()
  expect(executeProgram(prog4)).toEqual(2);
});