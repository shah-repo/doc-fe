import { GridProps } from '@progress/kendo-react-grid';
import { ColumnDefinition, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface SettingsTableProps<T extends EditableItem = EditableItem> {
  data: T[]
  schema: Array<ColumnDefinition<T>>
  addButtonLabel?: string
  onAdd?: () => void
  onRowClick?: GridProps['onRowClick']
  getRowProperties?: (item: T) => Record<string, unknown>
  isEditing?: boolean
  isActive?: boolean
}

export interface SettingsSchemaOptions<T extends EditableItem = EditableItem> {
  isActive: boolean
  onEdit?: (item: T) => void
  onActiveStateChange?: (item: T, state: boolean) => void
  onDelete?: (item: T) => void
  onDiscard: () => void
  onConfirm: () => unknown
}

export type SchemaBuilder<T extends EditableItem = EditableItem> = (options: SettingsSchemaOptions<T>) => Array<ColumnDefinition<T>>;
