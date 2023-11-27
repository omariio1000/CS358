// This code is our *runtime*: it provides primitive operations for interacting
// with the webpage. You're not expected to understand it, but feel free to ask
// outside of lecture if you're curious.
import { ValueType, Value } from "../AST";

type ImplType = {
  "num": number;
  "bool": boolean;
}

export const clearOutput = (): void => {
  const output = <HTMLOListElement> document.getElementById("print-output");
  output.innerHTML = "";
}

export const printLine = (value: Value): void => {
  const output = <HTMLOListElement> document.getElementById("print-output");
  const line = output.appendChild(document.createElement("li"));
  line.innerText = value.toString();
}

export const input = <T extends ValueType> (
  tag: T
): ImplType[T] => {
  while (true) {
    const text = prompt("Enter a value of type " + tag + ".")?.trim();
    if (text != null) {
      switch (tag) {
        case "num": {
          const parsed: number = Number.parseFloat(text);
          if (!Number.isNaN(parsed))
            return <ImplType[T]> parsed;
        }

        case "bool":
          switch (text) {
            case "true": return <ImplType[T]> true;
            case "false": return <ImplType[T]> false;
          }
      }
    }
  }
}
