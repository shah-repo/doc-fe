import { FBOptionProps } from "../types/common";

export type FBValidationModeType = "ValidationHidden" | "ValidationDisabled";

export enum FBValidationMode {
  ValidationHidden = "Show/Hide field",
  ValidationDisabled = "Enable/Disable field",
}

export type FBValidationModeProps =
  & Pick<FBOptionProps, "options">;
