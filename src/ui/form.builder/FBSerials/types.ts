export enum SerialNumberStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface SerialNumber {
  id: string
  serialNumber: string
  status: SerialNumberStatus | null
  lotId: string
  partId: string
  createdAt?: string
  updatedAt?: string
}

export interface EditableSerialNumber extends SerialNumber {
  selected?: boolean | number[]
}
