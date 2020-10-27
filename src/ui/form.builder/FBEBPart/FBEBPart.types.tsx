import { FBAutocompleteAsyncProps, FBFormProps, FBInputProps } from "..";

export type FBEBPartProps =
& Pick<FBFormProps, "formState">
& Pick<FBInputProps, "name" | "label" | "disabled">
& FBAutocompleteAsyncProps
& {
  onAddClick(): void;
};
