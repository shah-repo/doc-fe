import { FBInputProps } from "..";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
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
| "includeInInspection"
| "includeInFaiInspection"
| "deleteDisabled";

export type FBEditorPropertiesProps = Pick<FBInputProps, "type" | "options" | "onChange"> & {
  inputProps?: Partial<FBInputProps>;};

export const FBEditorPropertiesDefaultValue: Partial<Record<FBInputType, FBEditorPropertiesType[]>> = {
  procedure: ["copyableValue"],
  eqmaintenance: ["deleteDisabled"],
};

export const FBEditorPropertiesOmitByGroup = {
  [DOC_TYPE_GROUP_OPTION.PART]: ["includeInInspection", "includeInFaiInspection" ],
};

export type FBEditorPropertiesOption =
& Pick<FBOption, "text">
& {
  value?: string;
  outputText?: string; // Option as FBOption label text
  isOption?: boolean; // Whether the option will be treated as FBOption
};
