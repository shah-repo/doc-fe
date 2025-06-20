import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';

export interface ScanLot {
  lotId: string
  serialNumber: string
  QuantityAssigned: string
  unitOfMeasure: string
}

export interface EditableScanLot extends ScanLot {
  [MODE_FIELD]: Mode
}
