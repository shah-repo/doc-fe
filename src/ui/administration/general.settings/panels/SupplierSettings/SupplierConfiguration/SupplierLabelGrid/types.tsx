import {
  EditableItem,
} from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableSupplierLabel extends SupplierLabel, EditableItem {}

export interface SupplierLabel {
  id: string
  text: string
  isActive: boolean
  isUserAdded: boolean
}
