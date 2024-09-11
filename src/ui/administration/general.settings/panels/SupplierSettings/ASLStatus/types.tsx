import {
  CellTemplateProps,
  EditableItem,
} from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { OptionType } from '../SupplierConfiguration/types';

export interface EditableASLStatus extends ASLStatus, EditableItem {}

export enum ASLSTATUS_KEYS {
  id = 'id',
  order = 'order',
  internalType = 'internalType',
  displayOrder = 'displayOrder',
  displayLabel = 'displayLabel',
  isActive = 'isActive',
}

export interface ASLStatus {
  id: string
  internalType: string
  displayOrder: number
  order: number
  displayLabel: string
  isActive: boolean
}
export interface CustomCellProps extends CellTemplateProps<EditableASLStatus> {
  dataOptions?: OptionType[] | ASLStatus[]
  onActiveStateChange?: (item: EditableASLStatus, isActive: boolean) => void
}
