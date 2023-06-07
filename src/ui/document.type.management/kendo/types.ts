import { GridCellProps } from '@progress/kendo-react-grid';
import { GroupTag } from '../../../state/ducks/auth/types';
import { Nullable } from '../../../state/ducks/common/types';
import { DisplayFieldType, DocumentGroupOptionsType, InputFieldType, PageDetails, TooltipLabelConfig } from '../../../state/ducks/documentRevisions/documentType/types';
import { FBSchemaProps } from '../../form.builder/FBSchema/FBSchema.types';

interface IFieldConfigItem {
  visible: boolean
  required?: boolean
  label?: string
  tooltipConfig?: TooltipLabelConfig
}
type FieldConfig = { [key in FieldType]?: IFieldConfigItem };
type FieldType = InputFieldType | DisplayFieldType;

export interface CellCommandConfig extends GridCellProps {
  add: (dataItem: DTMRowItem) => void
  edit: (dataItem: DTMRowItem) => void
  update: (dataItem: DTMRowItem) => void
  cancel: (dataItem: DTMRowItem) => void
  remove: (dataItem: DTMRowItem) => void
  editField?: string
  disabled?: boolean
}

export interface DTMRowItem {
  hiddenForCreationForUsersWithoutTagsFormatted: GroupTag[]
  active: boolean
  canRedLine: boolean
  category: string
  companyId: string
  createdAt: string
  defaultRevStage: string
  defaultTraining: boolean
  documentTypeAcronym: string
  documentTypeName: string
  equipmentEnforceProd: boolean
  fieldsConfig: FieldConfig
  group: string
  groupOptions: DocumentGroupOptionsType[]
  hiddenForCreationForUsersWithoutTags: GroupTag[]
  id: string
  isQms: boolean
  needsSignature: boolean
  pageDetails: Nullable<PageDetails>
  privateNumberPool: boolean
  schema: FBSchemaProps[]
  startingNumber: number
  updatedAt: string
  inEdit?: boolean
}

export interface DTMAddRow {
  hiddenForCreationForUsersWithoutTagsFormatted?: GroupTag[]
  active?: boolean
  id?: string
  documentTypeAcronym: string
  documentTypeName: string
  group: string
  groupOptions?: DocumentGroupOptionsType[]
  pageDetails?: Nullable<PageDetails>
  isQms: boolean
  defaultTraining: boolean
  schema: FBSchemaProps[]
  fieldsConfig?: FieldConfig
  defaultRevStage?: Nullable<string>
  hiddenForCreationForUsersWithoutTags?: GroupTag[]
  privateNumberPool?: boolean
  canRedLine?: boolean
  needsSignature?: boolean
  startingNumber?: number
  category?: Nullable<string>
  inEdit? : boolean
  expanded?: boolean
  isNewRecord?: boolean
}
