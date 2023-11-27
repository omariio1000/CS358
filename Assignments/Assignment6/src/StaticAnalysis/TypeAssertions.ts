import { ValueType } from "../AST";

export class StaticTypeError extends Error {
  override name = "StaticTypeError";
}

export function assertType(expected: ValueType, actual: ValueType): void {
  if (expected != actual)
    throw new StaticTypeError(
      "expected type " + expected +
      ", got type " + actual
    );
}