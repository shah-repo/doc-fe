import { TreeListRowProps } from '@progress/kendo-react-treelist';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { FBInputProps } from '../../FBInput/FBInput.types';

export interface Material {
  id: string
  plannedId?: string
  actualId?: string
  lotId?: string
  lotNumber?: {[key: string]: string}
  unit?: string
  quantity?: number
  items?: Material[]
}

export interface MaterialTableProps {
  isActive: boolean
}

export interface EditableMaterial extends Material {
  [MODE_FIELD]: Mode
}

export type FBScanLotProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>;

export interface SchemaOptions {
  isLoading?: boolean
  units: string[]
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: (item: EditableMaterial) => void
  onEdit?: (item: EditableMaterial) => void
  onRowClick?: (e) => void
  onPrimaryChange?: (id: string) => void
  onOpenQuickView?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dataItem: EditableMaterial
  ) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableMaterial> {
  onClick?: (e) => void
  isLoading?: boolean
}

export interface UnitOption {
  value: string
  text: string
}

export interface ActionsProps<EditableMaterial> {
  dataItem: EditableMaterial
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  onConfirm: () => void
  onDiscard?: (dataItem: EditableMaterial) => void
  onDelete?: (dataItem: EditableMaterial) => void
  onChildPartAdd?: (dataItem: EditableMaterial) => void
  onRestore?: (dataItem: EditableMaterial) => void
  onReorder?: () => void
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: Material
}
