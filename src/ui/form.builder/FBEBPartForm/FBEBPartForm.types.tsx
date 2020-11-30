import { FBFormProps, FBInputProps } from "..";

export type FBEBPartFormProps =
& Pick<FBFormProps, "formState">
& Pick<FBInputProps, "children" | "disabled" | "loading">
& {
  onDialogClose?: () => void;
  onDialogConfirm?: () => void;
  ebId?: string;
};
