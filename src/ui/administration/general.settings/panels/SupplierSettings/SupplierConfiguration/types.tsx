import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableSupplierConfig extends SupplierConfig, EditableItem {
}

export const SUPPLIER_FIELDS = {
  capabilities: 'capabilities',
  services: 'services',
  type: 'type',
};
export interface OptionType {
  id: string
  text: string
}

export interface SupplierConfig {
  id: string
  supplierType: OptionType[]
  capabilities?: OptionType[]
  services?: OptionType[]
}

export interface CustomCellProps extends CellTemplateProps<EditableSupplierConfig>{
  dataOptions: OptionType[]
}
