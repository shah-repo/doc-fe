import { FBInputProps } from "../types/common";

export type FBEditorApprovalFieldProps =
& Pick<FBInputProps, "defaultValue" | "approverGroups" | "approvers">
& {
  includeLabel?: boolean;
};
