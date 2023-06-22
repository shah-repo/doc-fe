import { FBInputProps } from '../FBInput/FBInput.types';

export type VendorDataProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  items?: VendorData[]
};

export interface VendorData {
  supplier: string
  status: string
  partNumber: string
  cost: string
  unitsBuy: string
  conversion: number
  unitsUse: string
  leadTime: number

}
