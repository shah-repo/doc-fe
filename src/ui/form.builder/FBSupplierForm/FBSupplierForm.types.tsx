import { FBInputProps, FBProviderProps } from "..";
import { DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType/types";

export type FBSupplierFormProps =
& Pick<FBProviderProps, "formState" | "supplierState" >
& Pick<FBInputProps, "children" | "disabled" | "loading">
& {
  onDialogClose?: () => void;
  onDialogConfirm?: () => void;
  ebId?: string;
  formOptions?: DocumentTypeByIdForm[];
  formAutocompleteDisabled?: boolean;
};
