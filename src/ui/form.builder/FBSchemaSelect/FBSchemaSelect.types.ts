import { FBAutocompleteProps, FBInputProps, FBSchemaSelectState } from "..";
import { FBInputType } from "../FBInput";
import { FBSchemaComponentProps } from "../FBSchema/FBSchema.types";

export type FBSchemaSelectProps =
& Omit<FBAutocompleteProps, "autocompleteState">
& Pick<FBInputProps, "includeSelectedSchema">
& Pick<FBSchemaComponentProps, "schema">
& {
  schemaSelectState?: FBSchemaSelectState;
};

export const FBSchemeMultuValueTypes: FBInputType[] = ["checkboxgroup"];
