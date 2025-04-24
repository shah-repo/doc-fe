import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridPagerSettings } from '@progress/kendo-react-grid';

export const SELECTED_FIELD = 'isSelected';
export const EXPAND_FIELD = '_expanded';
export const DATA_ITEM_KEY = 'docRevId';
export const EMPTY_VALUE_PLACEHOLDER = '-';
export const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: [25, 50, 100],
  previousNext: true,
};
export const DEFAULT_FILTER: CompositeFilterDescriptor = {
  logic: 'and',
  filters: [],
};
