import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from './constants';

export interface GridItem {
  id?: string | number
  [MODE_FIELD]?: Mode
}

export interface GridProps<T extends GridItem> extends DataGridProps<T> {
  onSave?: (data: DataGridProps<T>['data']) => void
  disabled?: boolean
}
