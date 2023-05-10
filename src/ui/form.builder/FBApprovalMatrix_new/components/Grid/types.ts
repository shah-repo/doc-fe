import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from './constants';

export type GridItem<T> = T & {
  id?: string
  [MODE_FIELD]?: Mode
};

export interface GridProps<T> extends DataGridProps<T> {
  defaultNewValue: T
  onSave: (data: DataGridProps<T>['data']) => void
  disabled?: boolean
}
