import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableShippingItem) => void
  onRowClick?: (e: ShippingItemEditEvent) => void
}

export type FBShippingItemsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  shippingItems: ShippingItem[]
  setShippingItems: React.Dispatch<React.SetStateAction<ShippingItem[]>>
};

export interface ShippingItem {
  id: string
  itemId: string
  lotNumber: string[]
  quantity: string
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
