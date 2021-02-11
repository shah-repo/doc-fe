import { schema } from "normalizr";
import { SortDirectionType } from "react-virtualized/dist/es/Table";
import { Translation } from "../../translations/types";
import { TableColumnActionType, TableColumnProps } from "./column/types";

export type TableSelectionRenderer<T> = (
  props: TableSelectionProps<T>,
) => () => any;
export interface TableSearchQueryType {
  [key: string]: any;
}

export interface TableSelectionProps<T> {
  rowData: T;
  actionType?: TableColumnActionType;
}

export interface TableSortProps<T> {
  sortDirection?: SortDirectionType;
  sortBy?: string;
}

export interface TablePanelProps<T> {
  columns: TableColumnProps<T>[];
  noRowsTranslation?: Translation;
  cellMeasure?: boolean;
  onSelect?: TableSelectionRenderer<T>;
  searchable?: boolean;
  queryUrl?: string;
  clearFilter?: any;
  sortBy?: string;
  customQuerySet?: (queryDict: TableSearchQueryType) => TableSearchQueryType;
  customDataSet?: (data: T[]) => T[];
  tableName: string;
  providedData?: T[];
  rootCustomStyle?: any;
  normalizrSchema?: schema.Entity | schema.Entity[];
}

export interface TablePanelStateProps {
  queryDict: TableSearchQueryType;
  apiError: string;
  scrollToIndex: number;
  sortDirection?: SortDirectionType;
  forceUpdate: boolean;
}

export type TableDataProps<T> = T[];

// CSS
export interface TableStyleProps {
  isSelectable?: boolean;
  hasFixedHeight?: boolean;
}
