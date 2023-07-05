import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { FBInputProps } from '../FBInput/FBInput.types';
import { MODE_FIELD, Mode } from './constants';

export type VendorDataProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  items?: VendorData[]
  vendors?: VendorOption[]
  deleteVendorData?: (item: VendorData) => void
  updateLotTransfer?: (item: VendorData) => void
};

export interface VendorData {
  id: string
  vendor: string
  status: string
  partNumber: string
  cost: string
  unitsBuy: string
  conversion: number
  unitsUse: string
  leadTime: number

}

export interface EditableVendorData extends VendorData {
  [MODE_FIELD]: Mode
}

export interface VendorDataEditEvent {
  dataItem: EditableVendorData
}

type VendorOptionDocument = Pick<DocumentRevisionDocument, 'id' | 'docId' >;

export type VendorOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'status' | 'displayRevision'>
& {
  document: VendorOptionDocument
};
