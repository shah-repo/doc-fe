import { FBAutocompleteProps, FBInputProps, FBSchemaSelectState } from "..";
import { FBSchemaComponentProps } from "../FBSchema/FBSchema.types";

export type FBSchemaSelectProps =
& Omit<FBAutocompleteProps, "autocompleteState">
& Pick<FBInputProps, "includeSelectedSchema">
& Pick<FBSchemaComponentProps, "schema">
& {
  schemaSelectState?: FBSchemaSelectState;
};
