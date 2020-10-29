import { FBAutocompleteProps, FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBEBPartFormProps =
& Pick<FBFormProps, "formState">
& Pick<FBProviderProps, "dialogState">
& Pick<FBInputProps, "children" | "disabled">
& FBAutocompleteProps
& {
  onDialogClose?(): any;
  onDialogConfirm?(): any;
  ebId: string;
};
