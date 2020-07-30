import { addTestContext } from "./addTestContext";

export function ImplementedBy(...values: string[]) {
  if (!values.length) {
    return;
  }
  addTestContext("Implemented by", values.join("\n"));
}
