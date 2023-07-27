import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { FBInputProps } from '../FBInput/FBInput.types';
import { MODE_FIELD, Mode } from './constants';

export type FBPartVendorsProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  vendors?: VendorOption[]
  vendorData?: VendorData[]
  updateVendorData?: (item: VendorData) => void
  deleteVendorData?: (item: VendorData) => void
};

export interface VendorData {
  id: string
  primary: boolean
  supplier: string
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
