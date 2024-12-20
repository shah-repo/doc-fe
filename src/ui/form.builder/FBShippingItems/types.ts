import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  lots: DocumentRevision[]
  parts: PartOption[]
  isLotsloading: boolean
  isPartsloading: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableShippingItem) => void
  onRowClick?: (e: ShippingItemEditEvent) => void
  fetchLotsByPartId: (id?: string) => void
}

export type FBShippingItemsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  lots: DocumentRevision[]
  parts: PartOption[]
  isLotsloading: boolean
  isPartsloading: boolean
  shippingItems: ShippingItem[]
  fetchLotsByPartId: (id?: string) => void
  updateShippingItem: (item: ShippingItem) => void
  deleteShippingItem: (item: ShippingItem) => void
};

export interface ShippingItem {
  id: string
  part: {id: string, name: string}
  lot: {id: string, name: string}
  quantity: number
  comments: string
  createdDate: string
}

export interface EditableShippingItem extends ShippingItem {
  [MODE_FIELD]: Mode
}

export interface ShippingItemEditEvent {
  dataItem: EditableShippingItem
}

export interface CustomTemplateProps extends CellTemplateProps<EditableShippingItem> {
  onClick?: (e: ShippingItemEditEvent) => void
}

export type PartOption =
& Pick<DocumentRevision, 'id' | 'name' | 'displayRevision' | 'document'>;

export type UseOptionsHook = () => {
  lots: DocumentRevision[]
  parts: PartOption[]
  isLotsloading: boolean
  isPartsloading: boolean
  fetchLotsByPartId: (id: string) => void
};
