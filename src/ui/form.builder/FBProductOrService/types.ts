import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
  onRowClick?: (e: ProductORServiceEditEvent) => void
}

export type FBProductORServiceProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  items: ProductORService[]
  deleteItem: (item: ProductORService) => void
  updateItem: (item: ProductORService, id?: string) => void
};

export interface ProductORService {
  id: string
  itemId: string
  supplierPartNumber: string
  lifecyclePhase: string
  status: string
  comment: string
}

export interface EditableProductORService extends ProductORService {
  [MODE_FIELD]: Mode
}

export interface ProductORServiceEditEvent {
  dataItem: EditableProductORService
}

export interface CustomTemplateProps extends CellTemplateProps<EditableProductORService> {
  onClick?: (e: ProductORServiceEditEvent) => void
}
