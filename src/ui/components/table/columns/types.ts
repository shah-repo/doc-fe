import { TableCellProps } from "@material-ui/core/TableCell";
import { ColumnProps } from "react-virtualized";
import { Translation } from "../../../translations/types";
import { TableSelectionRenderer } from "../types";

export type TableColumnType = "BASE" | "LINK" | "ACTION";
export type TableColumnActionType = "EDIT" | "FILE_COPY" | "PREVIEW";
export type TableCellTypeRenderer<T> = (rowData: T) => TableColumnType;

export interface TableColumnProps<T> {
  key: string & keyof T;
  label: Translation;
  cellType?: TableColumnType | TableCellTypeRenderer<T>;
  columnOptions?: Partial<ColumnProps>;
  cellOptions?: Partial<TableCellProps>;
  onSelect?: TableSelectionRenderer<T>;
}

export interface TableColumnActionProps<T> {
  actionType: TableColumnActionType;
  rowData: T;
  onSelect?: TableSelectionRenderer<T>;
}
