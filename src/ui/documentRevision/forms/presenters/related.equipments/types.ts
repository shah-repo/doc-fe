import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Employee, EquipmentLocation } from '../../../../../state/ducks/company/types';
import { User } from '../../../../../state/ducks/auth/types';

export interface RelatedEquipmentsProps {
  parentDocumentRevision: DocumentRevision
  disabled?: boolean
  loading?: boolean
  relatedEquipments?: RelatedEquipment[]
  statuses?: string[]
  addRelatedEquipment?: (input: CreateRelatedEquipmentInput) => void
}

export interface SchemaOptions {
  relatedEquipments: RelatedEquipment[]
  statuses: string[]
  primaryOwners: Employee[]
  locations: EquipmentLocation[]
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
}

export interface RelatedEquipment extends DocumentRevision {
  docId: string
  documentRevisionId: string
  location?: string
  primaryOwner?: Employee
  needSync: boolean
  createdBy: User
  documentTypeId: string
  formDocumentId: string
  formDocumentIdLastReleased?: string
}

export interface CreateRelatedEquipmentInput {
  docId: string
  name: string
  primaryOwner: string
  location: string
  documentTypeId: string
  formDocumentId: string
}

export interface EditableRelatedEquipment extends RelatedEquipment {
  [MODE_FIELD]: Mode
}

interface RelatedEquipmentEditEvent {
  dataItem: EditableRelatedEquipment
}

export interface CustomTemplateProps extends CellTemplateProps<EditableRelatedEquipment> {
  onClick?: (e: RelatedEquipmentEditEvent) => void
}
