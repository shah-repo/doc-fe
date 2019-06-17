import {
  AutoSizer,
  Index,
  Size,
  Table,
  TableProps,
} from "react-virtualized";
import { Translation } from "../../translations/types";
import { TableColumnProps } from "./columns/types";

export interface TablePanelProps<T> {
  data: T[];
  columns: Array<TableColumnProps<T>>;
  noRowsTranslation: Translation;
}
