import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';

export enum SerialNumberStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum SerialNumberUsage {
  RND = 'R&D',
  DO_NOT_USE = 'DO_NOT_USE',
}

interface SerialNumberMeta {
  updatedIn?: {
    step?: number
    sequence?: number
  } | null
}

export interface SerialNumber {
  id: string
  serialNumber: string
  status: SerialNumberStatus | null
  usage: SerialNumberUsage | null
  notes: string | null
  lotId: string
  partId: string
  meta: SerialNumberMeta | null
  createdAt?: string
  updatedAt?: string
}

export interface SerialsSelectOption<T> {
  value: T | null
  text: string
}

export interface EditableSerialNumber extends SerialNumber {
  isSelected?: boolean | number[]
  isDisabled?: boolean
}

interface SerialNumberAddBody {
  serialNumbers: string[]
}

export interface SerialNumberExistingCheckBody {
  serialNumbers: string[]
}

export interface SerialNumberUpdateData {
  status?: SerialNumberStatus | null
  usage?: SerialNumberUsage | null
  notes?: string | null
  meta?: SerialNumberMeta | null
}

export type SerialNumberUpdatePayload = { id: string } & SerialNumberUpdateData;
interface SerialNumberUpdateBody {
  serialNumbers: SerialNumberUpdatePayload[]
}
interface SerialNumberDeleteBody {
  data: { ids: string[] }
}
export interface LotAndPart {
  lot?: DocumentRevision
  part?: DocumentRevision
}

export type FBSerialsStateBody = SerialNumberAddBody | SerialNumberUpdateBody | SerialNumberDeleteBody;
