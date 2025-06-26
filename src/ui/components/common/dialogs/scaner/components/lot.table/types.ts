import { FBInputProps } from '../../../../../../form.builder';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';

export interface ScanLot {
  lotId: string
  serialNumber: string
  QuantityAssigned: string
  unitOfMeasure: string
  id: string
}

export interface EditableScanLot extends ScanLot {
  [MODE_FIELD]: Mode
}

export type FBScanLotProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>;

export interface SchemaOptions {
  isInEditMode: boolean
  isLoading?: boolean
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRowClick?: (e) => void
  onPrimaryChange?: (id: string) => void
}
