import { FBInlineApprovalState } from ".";
import { FBButtonProps } from "../types/button";
import { FBInputProps } from "../types/common";

export type FBInlineApprovalMode = "placeholder" | "starter" | "defined";

export type FBInlineApprovalProps =
& Pick<FBInputProps, "name" | "index" | "type" | "approvers" | "approverGroups" | "approveIsBlocking">
& Pick<FBInputProps, "label">
& Pick<FBButtonProps, "onClick">
& {
  mode?: FBInlineApprovalMode;
  inlineApprovalState?: FBInlineApprovalState;
};
