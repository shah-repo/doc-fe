import { FBInputProps } from "..";
import { FBInputType } from "../FBInput";
import { FBOption } from "../FBOption";

export type FBEditorPropertiesType =
| "multiple"
| "includeNone"
| "includeContext"
| "includeQRScan"
| "reviseDisabled"
| "approveIsBlocking"
| "approvalNonVersioned"
| "copyableValue"
| "deleteDisabled";

export type FBEditorPropertiesProps = Pick<FBInputProps, "type" | "options" | "onChange">;

export const FBEditorPropertiesDefaultValue: Partial<Record<FBInputType, FBEditorPropertiesType[]>> = {
  procedure: ["copyableValue"],
  eqmaintenance: ["deleteDisabled"],
};

export type FBEditorPropertiesOption =
& Pick<FBOption, "text">
& {
  value?: string;
  outputText?: string; // Option as FBOption label text
  isOption?: boolean; // Whether the option will be treated as FBOption
};
