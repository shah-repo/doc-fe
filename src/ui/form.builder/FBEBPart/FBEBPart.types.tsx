import { FBAutocompleteAsyncProps, FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBEBPartProps =
& Pick<FBFormProps, "formState">
& Pick<FBProviderProps, "dialogState">
& Pick<FBInputProps, "name" | "label" | "disabled">
& FBAutocompleteAsyncProps
& {
  onAddClick(): void;
};
