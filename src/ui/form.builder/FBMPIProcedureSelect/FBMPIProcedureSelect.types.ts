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
  pmDueDate?: string
  calDueDate?: string
}

export enum EQStatus {
  NoInfo = 'No Info',
  Inactive = 'Inactive',
  Retired = 'Retired',
  Active = 'Active',
  ActiveCalibrated = 'Active Calibrated',
  ActiveNoCalRequired = 'Active No Cal Required',
}

export interface FBSelectedEQ {
  status: EQStatus
  pmDate?: string
  calDate?: string
}
