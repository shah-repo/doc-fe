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
  isLoading?: boolean
  onUpdateScanLot?: (item: ScanLot) => void
  onDeleteScanLot?: (item: ScanLot) => void
  setScanLots: Dispatch<SetStateAction<ScanLot[]>>
  type?: FBProcedureItemType
  isSerialNumberHidden?: boolean
}

export interface ValidateLot extends DocumentRevision {
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
  [MODE_FIELD]?: Mode
}

export interface SchemaOptions {
  isLoading?: boolean
  isSerialNumberHidden?: boolean
  onDelete?: (item: EditableScanLot) => void
  onEdit?: (item: EditableScanLot) => void
  onUpdateScanLot?: (item: EditableScanLot) => void
  onPrimaryChange?: (id: string) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableScanLot) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableScanLot> {
  onClick?: (e) => void
  isLoading?: boolean
  onUpdateScanLot?: (item: EditableScanLot) => void
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
