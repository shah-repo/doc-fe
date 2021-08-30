import { FBDialogState, FBFormProps, FBInputProps, FBSchemaComponentProps } from "..";

export type FBEditorValidationMode = "disabled" | "visibility" | "default";

export type FBEditorValidationProps =
& Pick<FBFormProps, "initialValues">
& Pick<FBInputProps, "onChange">
& Pick<FBSchemaComponentProps, "schema" | "schemaState">
& {
  handleCustomValidation?: () => any;
  customValidationEnabled?: boolean;
  dialogState?: FBDialogState;
};
