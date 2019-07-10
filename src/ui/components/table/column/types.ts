import { TableCellProps } from "@material-ui/core/TableCell";
import { CellMeasurerCache, ColumnProps } from "react-virtualized";
import { Translation } from "../../../translations/types";
import { TableSearchFieldProps } from "../search/types";
import { TableSelectionRenderer } from "../types";

export type TableColumnType = "BASE" | "LINK" | "ACTION";
export type TableColumnActionType = "EDIT" | "FILE_COPY" | "PREVIEW";
export type TableColumnSearchType = "FIELD" | "SELECT";
export type TableCellTypeRenderer<T> = (rowData: T) => TableColumnType;

export interface TableCellProps<T> {
  cellData: TableColumnActionType[];
  rowData: T;
}

export interface TableColumnProps<T> {
  key: string & keyof T;
  label: Translation;
  cellType?: TableColumnType | TableCellTypeRenderer<T>;
  columnOptions?: Partial<ColumnProps>;
  cellOptions?: Partial<TableCellProps>;
  tooltipKey?: keyof T;
  onSelect?: TableSelectionRenderer<T>;
  searchOptions?: Partial<TableSearchFieldProps>;
}

export interface TableColumnActionProps<T> {
  actionType: TableColumnActionType;
  rowData: T;
  onSelect?: TableSelectionRenderer<T>;
}

export interface InnerTableColumnProps {
  measurerCache: CellMeasurerCache;
  searchable?: boolean;
  queryGetter?: (key: string, value: string) => any;
}
