import { TableCellProps } from "@material-ui/core/TableCell";
import { ColumnProps } from "react-virtualized";
import { Translation } from "../../../translations/types";

export type TableColumnType = "BASE" | "LINK" | "ACTION";
export type TableColumnActionType = "EDIT" | "FILE_COPY" | "PREVIEW";
export type TableSelectionRenderer<T> = (props: TableSelectionProps<T>) => () => any;

export interface TableSelectionProps<T>  {
  rowData: T;
  actionType?: TableColumnActionType;
}

export interface TableColumnProps<T> {
  key: string & keyof T;
  label: Translation;
  cellType?: TableColumnType;
  columnOptions?: Partial<ColumnProps>;
  cellOptions?: Partial<TableCellProps>;
  onSelect?: TableSelectionRenderer<T>;
}

export interface TableColumnActionProps<T> {
  actionType: TableColumnActionType;
  rowData: T;
  onSelect?: TableSelectionRenderer<T>;
}
