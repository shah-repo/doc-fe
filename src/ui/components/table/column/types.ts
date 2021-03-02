import { TableCellProps as MuiTableCellProps } from "@material-ui/core/TableCell";
import {
  CellMeasurerCache,
  ColumnProps,
  SortDirectionType,
} from "react-virtualized";
import { Translation } from "../../../translations/types";
import { TableSearchFieldProps } from "../search/types";
import { TableSelectionRenderer } from "../types";

type TableColumnType = "BASE" | "LINK" | "ACTION";
export type TableColumnActionType = "EDIT" | "FILE_COPY" | "PREVIEW" | "ADD";
type TableCellTypeRenderer<T> = (rowData: T) => TableColumnType;
type TableCellTooltipRenderer<T> = (rowData: T) => string;

export interface TableCellProps<T> extends MuiTableCellProps {
  cellData: TableColumnActionType[];
  rowData: T;
}

export interface TableColumnProps<T> {
  key: string & keyof T;
  label: Translation;
  cellType?: TableColumnType | TableCellTypeRenderer<T>;
  columnOptions?: Partial<ColumnProps>;
  cellOptions?: Partial<TableCellProps<T>>;
  tooltipKey?: keyof T | TableCellTooltipRenderer<T>;
  onSelect?: TableSelectionRenderer<T>;
  searchOptions?: Partial<TableSearchFieldProps>;
  omitSearch?: boolean;
  sortable?: boolean;
  sortDirection?: SortDirectionType | undefined;
  cellHref?: (rowData: T) => string;
  withoutSearchRender?: boolean;
  // we will remove optional form id when we fill out all ids
  id?: string;
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
