import { Translation } from "../../translations/types";
import { TableColumnActionType, TableColumnProps } from "./columns/types";

export type TableSelectionRenderer<T> = (props: TableSelectionProps<T>) => () => any;

export interface TableSelectionProps<T>  {
  rowData: T;
  actionType?: TableColumnActionType;
}

export interface TablePanelProps<T> {
  data: T[];
  columns: Array<TableColumnProps<T>>;
  noRowsTranslation: Translation;
  onSelect?: TableSelectionRenderer<T>;
}

// CSS
export interface TableStyleProps {
  isSelectable: boolean;
  backgroundCellColor?: string;
}
