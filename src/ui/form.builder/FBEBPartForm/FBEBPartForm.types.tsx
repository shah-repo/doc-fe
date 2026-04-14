import { FBFormProps, FBInputProps } from '..';
import { DocumentType, DocumentTypeByIdForm } from '../../../state/ducks/documentRevisions/documentType/types';

export type FBEBPartFormProps =
& Pick<FBFormProps, 'formState'>
& Pick<FBInputProps, 'children' | 'disabled' | 'loading'>
& {
  onDialogClose?: () => void
  onDialogConfirm?: () => void
  ebId?: string
  formOptions?: DocumentTypeByIdForm[]
  formAutocompleteDisabled?: boolean
  docType?: DocumentType
};
