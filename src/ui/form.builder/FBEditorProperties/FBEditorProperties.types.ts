import { FBInputProps } from "..";
import { FBOption } from "../FBOption";

export type FBEditorPropertiesType =
| "multiple"
| "includeNone"
| "includeContext"
| "includeQRScan"
| "reviseDisabled"
| "approveIsBlocking";
export type FBEditorPropertiesProps = Pick<FBInputProps, "type" | "options" | "onChange">;
export type FBEditorPropertiesOption =
& Pick<FBOption, "text">
& {
  value: FBEditorPropertiesType;
  outputText?: string;
};
