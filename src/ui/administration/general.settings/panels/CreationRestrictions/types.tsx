import { CellTemplateProps, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface OptionType {
  id: string
  text: string
}

export interface DocumentTypeRestriction {
  id: string
  documentTypeId: string
  documentTypeName: string
  category: string
  restrictedToUsers: string[]
  restrictedToRoles: string[]
}

export interface EditableDocumentTypeRestriction extends DocumentTypeRestriction, EditableItem {
  restrictedToUsers_edit?: OptionType[]
  restrictedToRoles_edit?: OptionType[]
}

export interface CustomCellProps
  extends CellTemplateProps<EditableDocumentTypeRestriction> {
  dataOptions: OptionType[]
}
