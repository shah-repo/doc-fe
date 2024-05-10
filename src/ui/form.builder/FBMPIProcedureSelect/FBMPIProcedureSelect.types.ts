import { FBFormProps, FBInputProps, FBProcedureItemType, FBProviderProps } from '..';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';

export type FBMPIProcedureSelectProps =
& Pick<FBInputProps, 'name'>
& Pick<FBFormProps, 'children' | 'initialValues'>
& Pick<FBProviderProps, 'formState' | 'mpiProcedureSelectState'>
& {
  type: FBProcedureItemType
  unitDisabled?: boolean
  selectedEQ?: any
  isOptionDisabled?: (option: any) => any
  renderOptionWithDate?: (option: any) => any
  onChange?: () => void
  isLHRProductionBuild?: boolean
};

export interface FBMPIProcedureSelectValue {
  fieldId: string
  forPreselected: { id: string }
  usedOverride: Partial<DocumentRevision> | string
  type: FBProcedureItemType | 'MATERIAL' | 'EQUIPMENT'
  overrideDocId?: string
  refId?: string
  materialId?: string
  equipmentId?: string
  quantity?: number
  unit?: string
  lotPart?: string
  lotPartRevision?: string
  pmDueDate?: string
  calDueDate?: string
}

export enum DOCUMENT_REVISION_LOT_STATUS {
  QUARANTINE = 'QUARANTINE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  USE_AS_IS = 'USE_AS_IS',
  RTV = 'RETURN_TO_VENDOR',
  REWORK = 'REWORK',
  SCRAP = 'SCRAP',
  RD_USED_ONLY = 'R&D_USED_ONLY',
  OTHER = 'OTHER',
  VOIDED = 'VOIDED',
}

export enum EQStatus {
  NoInfo = 'No Info',
  Inactive = 'Inactive',
  Retired = 'Retired',
  Active = 'Active',
  ActiveCalibrated = 'Active Calibrated',
  ActiveNoCalRequired = 'Active No Cal Required',
  OutForCalibration = 'Out for Calibration',
  OutForMaintenance = 'Out for Maintenance',
  UnplannedDowntime = 'Unplanned Downtime',
}

export interface FBSelectedEQ {
  status: EQStatus
  pmDate?: string
  calDate?: string
}
