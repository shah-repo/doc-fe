import { Dictionary } from "lodash";

export interface FBValidationProps {
  toStringRules?: (validators: Dictionary<any>) => string | undefined;
}
