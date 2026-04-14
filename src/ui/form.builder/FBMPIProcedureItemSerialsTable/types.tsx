import { SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUsage } from '../FBSerials/types';

export interface FBMPIProcedureItemSerialsTableProps {
  name?: string
  stepIndex?: number
  isPreview?: boolean
  disabled?: boolean
}

export interface LHRSSerialNumbers {
  isRnD: boolean
  isLoading: boolean
  shouldShowSerials: boolean
  stepSerialNumbers: SerialNumber[]
  allSerialNumbers: SerialNumber[]
  updateSerialNumber: (id: string, data: SerialNumberUpdateData) => Promise<void>
}

export interface LHRSStepSerialNumbersFormValue {
  serialsNumbers?: Record<string, { status: SerialNumberStatus, usage: SerialNumberUsage, notes: string }>
}
