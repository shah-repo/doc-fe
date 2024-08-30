import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableReference) => void
  onRowClick?: (e: ReferenceEditEvent) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableReference) => void
}

export type FBReferenceProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  references: Reference[]
  setReferences: React.Dispatch<React.SetStateAction<Reference[]>>
};

export interface Reference {
  id: string
  referenceRevId: string
  referenceDisplayName?: string
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
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableReference) => void
}
