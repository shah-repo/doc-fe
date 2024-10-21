import { ColumnDefinition, DataGridProps, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface SettingsTableProps<T extends EditableItem = EditableItem> extends DataGridProps<T> {
  addButtonLabel?: string
  onAdd?: () => void
  getRowProperties?: (item: T) => Record<string, unknown>
  isEditing?: boolean
  isActive?: boolean
}

interface SettingsSchemaOptions<T extends EditableItem = EditableItem> {
  isActive: boolean
  onEdit?: (item: T) => void
  onActiveStateChange?: (item: T, state: boolean) => void
  onDelete?: (item: T) => void
  onDiscard: () => void
  onConfirm: () => unknown
}

export type SchemaBuilder<T extends EditableItem = EditableItem, O = Record<string, unknown>> = (options: SettingsSchemaOptions<T> & O) => Array<ColumnDefinition<T>>;
