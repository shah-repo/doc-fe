import { SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';

export interface FBMPIProcedureItemSerialsTableProps {
  name?: string
  isPreview?: boolean
  disabled?: boolean
}

export interface LHRSSerialNumbers {
  isRnD: boolean
  isLoading: boolean
  shouldShowSerials: boolean
  stepSerialNumbers: SerialNumber[]
  allSerialNumbers: SerialNumber[]
  lhrsInfo: {
    step?: number
    sequence?: number
  }
  updateSerialNumber: (id: string, data: SerialNumberUpdateData) => Promise<void>
  updateSerialNumbers: (payload: SerialNumberUpdatePayload[]) => Promise<void>
}

export interface LHRSStepSerialNumbersFormValue {
  serialsNumbers?: Record<string, { status: SerialNumberStatus, usage: SerialNumberUsage, notes: string }>
}
