import { FBInlineApprovalTransition, FBProviderProps } from "..";

export type FBApprovalPasswordFormProps =
& Pick<FBProviderProps, "dialogState" | "formState">
& {
  approvalTransition(transition: FBInlineApprovalTransition, approvalId: string): void;
  approvalId: string;
  onDialogClose?(): void;
};
