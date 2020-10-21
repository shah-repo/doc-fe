import { FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBEBPartDialogProps =
& Pick<FBFormProps, "formState">
& Pick<FBProviderProps, "dialogState">
& Pick<FBInputProps, "name" | "children">
& {
  onDialogClose?(): any;
  onDialogConfirm?(): any;
};
