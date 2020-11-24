import { FBFormProps, FBInlineApprovalTransition, FBInputProps, FBProviderProps } from "..";

export type FBApprovalPasswordFormProps =
& Pick<FBProviderProps, "dialogState">
& Pick<FBFormProps, "formState">
& Pick<FBInputProps, "name">
& {
  approvalTransition?(transition: FBInlineApprovalTransition, approvalId: string): void;
  approvalId?: string;
  onDialogClose?(): any;
  onDialogApprove?(): any;
};
