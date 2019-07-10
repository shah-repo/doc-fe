import { Translation } from "../../translations/types";
import { TableColumnActionType, TableColumnProps } from "./column/types";

export type TableSelectionRenderer<T> = (props: TableSelectionProps<T>) => () => any;

export interface TableSelectionProps<T>  {
  rowData: T;
  actionType?: TableColumnActionType;
}

export interface TablePanelProps<T> {
  tableData: T[];
  columns: Array<TableColumnProps<T>>;
  noRowsTranslation: Translation;
  cellMeasure?: boolean;
  onSelect?: TableSelectionRenderer<T>;
  searchable?: boolean;
  queryUrl?: string;
}

export interface TablePanelStateProps<T> {
  queryData: T[];
  queryDict: { [key: string]: string; };
  apiError: string;
}

// CSS
export interface TableStyleProps {
  isSelectable?: boolean;
  hasFixedHeight?: boolean;
}
