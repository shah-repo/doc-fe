import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface GridProps<T> extends DataGridProps<T> {
  onSave?: (data: DataGridProps<T>['data']) => void
  disabled?: boolean
}
