import { FBFormProps, FBInputProps, FBSchemaComponentProps } from "..";

export type FBEditorValidationMode = "disabled" | "visibility";

export type FBEditorValidationProps =
& Pick<FBFormProps, "initialValues">
& Pick<FBInputProps, "onChange">
& Pick<FBSchemaComponentProps, "schema" | "schemaState">;
