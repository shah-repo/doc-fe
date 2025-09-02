import { Dispatch, SetStateAction } from 'react';
import { DocumentRevision } from '../../../../../../../state/ducks/documentRevisions/types';
import { FBProcedureItemType } from '../../../../../../form.builder';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';

export interface ScanLot {
  lotId?: string
  lotNumber?: { [key: string]: string | undefined }
  serialNumber?: string
  QuantityAssigned?: string
  unitOfMeasure?: string
  id?: string
  lotRevId?: string
  quantityAssigned?: number
  calDueDate?: string
  pmDueDate?: string
  onHand?: number
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
  type?: FBProcedureItemType
  isSerialNumberHidden?: boolean
}

export interface ValidateLot extends DocumentRevision{
  isExpired: boolean
  lotRevId: string
  partRevId: string
  lotUsedUnit: string
  onHand: number
  partRevDisplayRevision: string
  releasedAt: string
  used: number
  serialNumber: string
}

export interface EditableScanLot extends ScanLot {
  [MODE_FIELD]: Mode
}

export interface SchemaOptions {
  isLoading?: boolean
  isSerialNumberHidden?: boolean
  units: string[]
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: (item: EditableScanLot) => void
  onEdit?: (item: EditableScanLot) => void
  updateScanLot?: (item: EditableScanLot) => void
  onRowClick?: (e) => void
  onPrimaryChange?: (id: string) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableScanLot) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableScanLot> {
  onClick?: (e) => void
  isLoading?: boolean
  updateScanLot?: (item: EditableScanLot) => void
}

export interface UnitOption {
  value: string
  text: string
}

export interface ScanSelectedPartItem {
  id?: string
  docId: string
  partDescription?: string
  quantityNeeded?: number
  displayRevision?: string
  variance?: string
  partRevId?: string
  woId?: string
  plannedId?: string
  type?: FBProcedureItemType
}
