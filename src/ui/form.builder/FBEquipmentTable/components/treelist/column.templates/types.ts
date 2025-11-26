import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { EditableEquipmentItem } from '../../../interface';

export interface customEQOptionType extends OptionType{
  complianceDueDate: string
  calDueDate?: string
  pmDueDate?: string
  status: string
}
export interface CustomTreeListCellProps extends TreeListCellProps {
  isDisabled?: boolean
  isEnableActualIdAddition?: boolean
  dataItem: EditableEquipmentItem
  getItem?: (id: string) => string
  addActualId?: EquipmentCallback
  onScanClick?: EquipmentCallback
  deleteLot?: EquipmentCallback
  deletePart?: EquipmentCallback
  onClick?: (event: { dataItem: EditableEquipmentItem }) => void
  parentRevId?: string
  equipmentOptions: customEQOptionType[]
  isMPIForm?: boolean
  isEBProcedure?: boolean
}

export interface EquipmentItemActionsProps<T> {
  dataItem: T
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  isEnableActualIdAddition?: boolean
  isEBProcedure?: boolean
  onConfirm: () => void
  onDiscard?: EquipmentCallback
  onDelete?: EquipmentCallback
  onChildPartAdd?: EquipmentCallback
  onRestore?: EquipmentCallback
  onReorder?: () => void
}

export interface EquipAutoCompleteOptions {
  label: string
  value: string
  isExpired?: boolean
  expiryDate?: string
}

type EquipmentCallback = (dataItem: EditableEquipmentItem) => void;

export type EquipOption =
& Pick<DocumentRevision, 'id' | 'name' | 'displayRevision' | 'document' | 'formInput'>;
