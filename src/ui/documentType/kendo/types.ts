import { schema } from "normalizr";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanelStateProps, TableSearchQueryType, TableSelectionRenderer } from "../../components/table/types";
import { Translation } from "../../translations/types";

export interface KendoPanelProps<T> {
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
  tableCriteria: TablePanelStateProps;
}
