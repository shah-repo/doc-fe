import { Translation } from "../../translations/types";
import { TableColumnActionType, TableColumnProps } from "./column/types";

export type TableSelectionRenderer<T> = (props: TableSelectionProps<T>) => () => any;
export interface TableSearchQueryType { [key: string]: any; }

export interface TableSelectionProps<T>  {
  rowData: T;
  actionType?: TableColumnActionType;
}

export interface TablePanelProps<T> {
  tableData: T[];
  columns: Array<TableColumnProps<T>>;
  noRowsTranslation?: Translation;
  cellMeasure?: boolean;
  onSelect?: TableSelectionRenderer<T>;
  searchable?: boolean;
  queryUrl?: string;
  clearFilter?: any;
  customQuerySet?: (queryDict: TableSearchQueryType) => TableSearchQueryType;
  customDataSet?: (data: T[]) => T[];
}

export interface TablePanelStateProps<T> {
  queryData: T[];
  queryDict: TableSearchQueryType;
  apiError: string;
  scrollToIndex: number;
}

// CSS
export interface TableStyleProps {
  isSelectable?: boolean;
  hasFixedHeight?: boolean;
}
