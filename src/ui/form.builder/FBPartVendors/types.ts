import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import { FBInputProps } from '../FBInput/FBInput.types';

export type FBPartVendorsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  list: Vendor[]
  units: string[]
  statuses: string[]
  suppliers: SupplierOption[]
  standardCost?: Cost
  standardLeadTime?: number
  updateVendor: (item: Vendor) => void
  deleteVendor: (item: Vendor) => void
  setPrimaryVendor: (id: string) => void
  setStandardCost: (value: number) => void
  setStandardLeadTime: (value: number) => void
};

export interface InputData {
  list?: Vendor[]
  standardCost?: Cost
  standardLeadTime?: number
}

export interface Cost {
  value: number
  currency: string
}
export interface Supplier {
  id: string
  name: string
  status?: string
}

export interface UnitOption {
  value: string
  text: string
}

export type UseOptionsHook = () => {
  units: string[]
  statuses: string[]
  suppliers: SupplierOption[]
};

export interface Vendor {
  id: string
  primary: boolean
  vendor: Supplier
  status: string
  partNumber: string
  cost: Cost
  unitsBuy: string
  conversion: number
  unitsUse: string
  leadTime: number
}

export interface EditableVendor extends Vendor {
  [MODE_FIELD]: Mode
}

export interface VendorEditEvent {
  dataItem: EditableVendor
}

type VendorOptionDocument = Pick<DocumentRevisionDocument, 'id' | 'docId' >;

export type SupplierOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'displayStatus' | 'displayRevision'>
& {
  document: VendorOptionDocument
};

export interface CustomTemplateProps extends CellTemplateProps<EditableVendor> {
  onClick?: (e: VendorEditEvent) => void
}
