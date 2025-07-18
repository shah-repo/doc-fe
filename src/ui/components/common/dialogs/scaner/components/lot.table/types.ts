import { Dispatch, SetStateAction } from 'react';
import { DocumentRevision } from '../../../../../../../state/ducks/documentRevisions/types';
import { FBInputProps } from '../../../../../../form.builder';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';

export interface ScanLot {
  lotId: string
  lotNumber: {[key: string]: string}
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
  loading?: boolean
  updateScanLot?: (item: ScanLot) => void
  deleteScanLot?: (item: ScanLot) => void
  setScanLots: Dispatch<SetStateAction<ScanLot[]>>
}

export interface EditableScanLot extends ScanLot {
  [MODE_FIELD]: Mode
}

export type FBScanLotProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>;

export interface SchemaOptions {
  isLoading?: boolean
  units: string[]
  lots: DocumentRevision[]
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: (item: EditableScanLot) => void
  onEdit?: (item: EditableScanLot) => void
  onRowClick?: (e) => void
  onPrimaryChange?: (id: string) => void
  onOpenQuickView?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dataItem: EditableScanLot
  ) => void
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

export interface ScanSelectedPartItem {
  docId: string
  partDescription?: string
  quantityNeeded?: number
  displayRevision?: string
  variance: string
  partRevId?: string
}
