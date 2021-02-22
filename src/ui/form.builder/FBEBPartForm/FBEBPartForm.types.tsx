import { FBFormProps, FBInputProps } from "..";
import { DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType";

export type FBEBPartFormProps =
& Pick<FBFormProps, "formState">
& Pick<FBInputProps, "children" | "disabled" | "loading">
& {
  onDialogClose?: () => void;
  onDialogConfirm?: () => void;
  ebId?: string;
  formOptions?: DocumentTypeByIdForm[];
  formAutocompleteDisabled?: boolean;
};
