import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
  onRowClick?: (e: ReferenceEditEvent) => void
}

export type FBReferenceProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  references: Reference[]
  deleteReference: (item: Reference) => void
  updateReference: (item: Reference, id?: string) => void
};

export interface Reference {
  id: string
  referenceId: string
  revision: string
  title: string
  status: string
  owner: string
  createdDate: string
}

export interface EditableReference extends Reference {
  [MODE_FIELD]: Mode
}

export interface ReferenceEditEvent {
  dataItem: EditableReference
}

export interface CustomTemplateProps extends CellTemplateProps<EditableReference> {
  onClick?: (e: ReferenceEditEvent) => void
}
