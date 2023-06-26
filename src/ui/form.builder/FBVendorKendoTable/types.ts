import { FBInputProps } from '../FBInput/FBInput.types';
import { MODE_FIELD, Mode } from './constants';

export type VendorDataProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  items?: VendorData[]
};

export interface VendorData {
  id: string
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
