import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface TasksListItem {
  id: string
  number: string
  instructions: string
  assignedTo: OptionType[]
  comments: any
  assigneeActions: string[]
}

export interface EditableTLItem extends TasksListItem {
  [MODE_FIELD]: Mode
}

export interface TLItemEditEvent {
  dataItem: EditableTLItem
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRowClick?: (e: TLItemEditEvent) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableTLItem> {
  onClick?: (e: TLItemEditEvent) => void
}
