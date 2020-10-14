import { FBFormProps, FBInputProps } from "..";

export type FBApprovalPasswordFormProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& {
  handleAdd?: () => any;
  handleCancel?: () => any;
};
