import { FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBEBPartFormProps =
& Pick<FBFormProps, "formState">
& Pick<FBProviderProps, "dialogState">
& Pick<FBInputProps, "children">
& {
  onDialogClose?(): any;
  onDialogConfirm?(): any;
};
