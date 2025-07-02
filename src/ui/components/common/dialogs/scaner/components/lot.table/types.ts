import { DocumentRevision } from '../../../../../../../state/ducks/documentRevisions/types';
import { FBInputProps } from '../../../../../../form.builder';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';

export interface ScanLot {
  lotId: string
  serialNumber: string
  QuantityAssigned: string
  unitOfMeasure: string
  id: string
}

export interface ScanLotTableProps {
  scanLots: ScanLot[]
  units: string[]
  lots: DocumentRevision[]
  disabled?: boolean
  partId?: string
  updateScanLot?: (item: ScanLot) => void
  deleteScanLot?: (item: ScanLot) => void
}

export interface EditableScanLot extends ScanLot {
  [MODE_FIELD]: Mode
}

export type FBScanLotProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>;

export interface SchemaOptions {
  isInEditMode: boolean
  isLoading?: boolean
  units: string[]
  lots: DocumentRevision[]
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRowClick?: (e) => void
  onPrimaryChange?: (id: string) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableScanLot> {
  onClick?: (e) => void
  isLoading?: boolean
}

export interface UnitOption {
  value: string
  text: string
}

export type UseOptionsHook = () => {
  units: string[]
};
