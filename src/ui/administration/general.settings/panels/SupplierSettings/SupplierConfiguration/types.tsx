import {
  CellTemplateProps,
  EditableItem,
} from '../../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableSupplierConfig extends SupplierConfig, EditableItem {
  services_edit?: string
  capabilities_edit?: string
}

export interface OptionType {
  id: string
  text: string
  isActive?: boolean
}

export interface SupplierConfig {
  id: string
  text: string
  supplierTypeId: string
  capabilities?: OptionType[]
  services?: OptionType[]
}

export interface CustomCellProps
  extends CellTemplateProps<EditableSupplierConfig> {
  dataOptions: OptionType[]
}
