import { Dispatch, SetStateAction } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { FBInputProps } from '../../FBInput/FBInput.types';

export interface Material {
  id: string
  plannedId: string
  actualId: string
  lotId: string
  lotNumber: {[key: string]: string}
  unitOfMeasure: string
}

export interface MaterialTableProps {
  plannedId: string
  actualId: string
  lotId: string
  units: string[]
  lotNumber: {[key: string]: string}
  unitOfMeasure: string
  materials: Material[]
  disabled?: boolean
  updateMaterial?: (item: Material) => void
  deleteMaterial?: (item: Material) => void
  setMaterials: Dispatch<SetStateAction<Material[]>>
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
