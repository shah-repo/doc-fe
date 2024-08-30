import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (item: ProductORService) => void
  onRowClick?: (e: ProductORServiceEditEvent) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableProductORService) => void
}

export type FBProductORServiceProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  productOrServices: ProductORService[]
  setProductOrServices: React.Dispatch<React.SetStateAction<ProductORService[]>>
};

export interface ProductORService {
  id: string
  revId: string
  title?: string
  itemDisplayName?: string
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
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableProductORService) => void
}
