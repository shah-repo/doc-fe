import { FBFormProps, FBInputProps, FBWorkspaceProps } from "..";

export type FBEditorValidationMode = "disabled" | "visibility";

export type FBEditorValidationProps =
& Pick<FBFormProps, "initialValues">
& Pick<FBWorkspaceProps, "schema">
& Pick<FBInputProps, "onChange">;
