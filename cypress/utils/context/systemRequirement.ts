import codes from "./../../cache/generated.json";
import { addTestContext } from "./addTestContext";

const requirementIds = Object.keys(codes);

export const CONTEXT_SYSTEM_REQUREMENT = "CONTEXT_SYSTEM_REQUREMENT";
const REQUIREMENT_HEADER_TEXT = "Requirement";
const formatValue = (v) => `${v} (${codes[v].field1}): ${codes[v][REQUIREMENT_HEADER_TEXT]}`;
export const SYSTEM_REQUREMENT_TITLE = "Implements requirements";

export function SystemRequirement(value: string, ...values: string[]) {
  const filteredValues = [value, ...values].map((v) => {
    if (!requirementIds.includes(v)) {
      console.log({ "Not found requirement in spec": v });
    } else {
      return v;
    }
  }).filter((x) => x);
  if (filteredValues.length) {
    addTestContext(SYSTEM_REQUREMENT_TITLE, filteredValues.map(formatValue).join("\n"));
  }
}
