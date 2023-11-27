import { ValueType, Value } from "./AST";

export type Scope<T> = Map<string, T>;

export type StaticLocalScope = Scope<ValueType>;
export type DynamicLocalScope = Scope<Value>;

export type NestedScope<T> = Scope<T>[] & { 0: Scope<T> };

export type StaticNestedScope = NestedScope<ValueType>;
export type DynamicNestedScope = NestedScope<Value>;

export class ScopeError extends Error {
  override name = "ScopeError";
}

export function pushLocalScope<T>(programScope: NestedScope<T>): void {
  programScope.unshift(new Map());
}

export function popLocalScope<T>(programScope: NestedScope<T>): void {
  programScope.shift();
}

export function lookup<T>(
  name: string,
  programScope: NestedScope<T>
): T {
  for (const nestedScope of programScope) {
    const value = nestedScope.get(name);
    if (value != null)
      return value;
  }
  throw new ScopeError("name is not in scope: " + name);
}

export function declare<T>(
  name: string,
  entry: T,
  programScope: NestedScope<T>
): void {
  if (programScope[0].has(name))
    throw new ScopeError("duplicate variable definition: " + name);
  programScope[0].set(name, entry);
}

export function update(
  name: string,
  entry: Value,
  programScope: DynamicNestedScope
): void {
  for (const nestedScope of programScope) {
    if (nestedScope.has(name)) {
      nestedScope.set(name, entry);
      return;
    }
  }
  throw new ScopeError("assignment to undeclared variable name: " + name);
}
