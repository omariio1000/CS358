import { Func } from "./AST";

// In this toy language, a program is just a bunch of function definitions. The
// fact that this is a **read-only** map indicates that all of our function
// calls will be statically dispatched: the meaning of every function name is
// set in stone before the program begins executing.
export type Program = ReadonlyMap<string, Func>;

export class DispatchError extends Error { };

// This is just like the lookup function for our Scope type, but it looks up a
// *function definition* by name.
export function dispatch(prog: Program, funcName: string): Func {
  const func = prog.get(funcName);
  if (func == null)
    throw new DispatchError("undefined function: " + funcName);
  else
    return func;
}