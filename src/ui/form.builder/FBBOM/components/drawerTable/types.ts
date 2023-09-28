import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { AlternatePartEditEvent, EditableAlternatePart } from '../treelist/interface';

export interface CustomTemplateProps extends CellTemplateProps<EditableAlternatePart> {
  onClick?: (event: AlternatePartEditEvent) => void
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem) => void
  isDisabled?: boolean
}
