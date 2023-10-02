import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  units: string[]
  statuses: string[]
  suppliers: SupplierOption[]
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
  onRowClick?: (e: VendorEditEvent) => void
  onPrimaryChange?: (id: string) => void
}

export enum Currency {
  USD = 'USD',
}

export type FBPartVendorsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  vendors: Vendor[]
  units: string[]
  statuses: string[]
  suppliers: SupplierOption[]
  updateVendor: (item: Vendor) => void
  deleteVendor: (item: Vendor) => void
  setPrimaryVendor: (id: string) => void
};

interface Cost {
  value: number
  currency: Currency
}
interface Supplier {
  id: string
  name: string
  displayStatus?: string
}

export interface UnitOption {
  value: string
  text: string
}

export type UseOptionsHook = (suppliersList: Supplier[]) => {
  units: string[]
  statuses: string[]
  suppliers: SupplierOption[]
};

export interface Vendor {
  id: string
  primary: boolean
  vendor: Supplier
  status?: string
  partNumber?: string
  cost?: Cost
  unitsBuy?: string
  conversion?: number
  unitsUse?: string
  leadTime?: number
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
  isUnselectable?: boolean
};

export interface CustomTemplateProps extends CellTemplateProps<EditableVendor> {
  onClick?: (e: VendorEditEvent) => void
}
