import { GridProps, GridSortChangeEvent } from '@progress/kendo-react-grid';
import { ColumnDefinition, DataGridProps, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface SettingsTableProps<T extends EditableItem = EditableItem> extends DataGridProps<T>{
  data: T[]
  schema: Array<ColumnDefinition<T>>
  addButtonLabel?: string
  onAdd?: () => void
  onRowClick?: GridProps['onRowClick']
  getRowProperties?: (item: T) => Record<string, unknown>
  isEditing?: boolean
  isActive?: boolean
  sort?: Array<{ field: string, dir: 'asc' | 'desc' }>
  onDataSortChange?: (event: GridSortChangeEvent) => void
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
