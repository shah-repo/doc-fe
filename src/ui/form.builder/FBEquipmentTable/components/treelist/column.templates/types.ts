import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { EditableEquipmentItem } from '../../../types';

export interface customEQOptionType extends OptionType{
  complianceDueDate: string
  calDueDate?: string
  pmDueDate?: string
  status?: string
  docStatus?: string
  category?: string
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
  releasedEquipmentOptions?: customEQOptionType[]
  filterEquipmentOptions?: customEQOptionType[]
  allowedEditEqOptions?: customEQOptionType[]
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

type EquipmentCallback = (dataItem: EditableEquipmentItem) => void;

export type EquipOption =
& Pick<DocumentRevision, 'id' | 'name' | 'displayRevision' | 'document' | 'formInput' | 'eqStatus' | 'status' | 'precalc'>;
