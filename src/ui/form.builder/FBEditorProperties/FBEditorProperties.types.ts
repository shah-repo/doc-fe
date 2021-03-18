import { FBInputProps, FBOption } from "..";
import { DocumentGroupOptionsType, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";

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
| "deleteDisabled"
| "includeNotes";

export type FBEditorPropertiesProps = Pick<FBInputProps, "type" | "options" | "onChange"> & {
  inputProps?: Partial<FBInputProps>;
  docGroupOptions?: DocumentGroupOptionsType[];
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
