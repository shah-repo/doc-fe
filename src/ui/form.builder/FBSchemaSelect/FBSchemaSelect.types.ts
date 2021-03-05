import { FBAutocompleteProps, FBInputProps, FBInputType, FBSchemaComponentProps, FBSchemaSelectState } from "..";

export type FBSchemaSelectProps =
& Omit<FBAutocompleteProps, "autocompleteState">
& Pick<FBInputProps, "includeSelectedSchema">
& Pick<FBSchemaComponentProps, "schema">
& {
  schemaSelectState?: FBSchemaSelectState;
};

export const FBSchemeMultuValueTypes: FBInputType[] = ["checkboxgroup"];
