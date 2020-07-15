import codes from "./../../requirements/cache/generated.json";
import { addTestContext } from "./addTestContext";
export type RequirementId = keyof typeof codes;

export const CONTEXT_SYSTEM_REQUREMENT = "CONTEXT_SYSTEM_REQUREMENT";
const REQUIREMENT_HEADER_TEXT = "Requirement";
const formatValue = (v) => `${v}: ${codes[v][REQUIREMENT_HEADER_TEXT]}`;
export const SYSTEM_REQUREMENT_TITLE = "Implements requirements";

export function SystemRequirement(value: RequirementId, ...values: RequirementId[]) {
  addTestContext(SYSTEM_REQUREMENT_TITLE, [value, ...values].map(formatValue).join("\n"));
}
