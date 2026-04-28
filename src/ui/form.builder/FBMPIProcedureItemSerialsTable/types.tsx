import { SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';

export interface FBMPIProcedureItemSerialsTableProps {
  name?: string
  isPreview?: boolean
  disabled?: boolean
}

export interface LHRSInfo {
  stepIndex?: number
  isSynced: boolean
  rejectedCount: number
  acceptedCount: number
}

export interface LHRSSequenceInfo {
  step?: number
  sequence?: number
}

export interface LHRSSerialNumbers {
  isRnD: boolean
  isLoading: boolean
  shouldShowSerials: boolean
  stepSerialNumbers: SerialNumber[]
  allSerialNumbers: SerialNumber[]
  lhrsInfo: LHRSInfo
  lhrsSequenceInfo: LHRSSequenceInfo
  updateSerialNumber: (id: string, data: SerialNumberUpdateData) => Promise<void>
  updateSerialNumbers: (payload: SerialNumberUpdatePayload[]) => Promise<void>
}

export interface LHRSStepSerialNumbersFormValue {
  serialsNumbers?: Record<string, { status: SerialNumberStatus, usage: SerialNumberUsage, notes: string }>
}
