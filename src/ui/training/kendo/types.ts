import { schema } from "normalizr";
import {
  TableSearchQueryType,
  TableSelectionRenderer,
} from "../../components/table/types";
import { Translation } from "../../translations/types";

export interface KendoPanelProps<T> {
  columns: any;
  createUrl?: string;
  dialog?: any;
  headers?: any;
  data?: any;
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
  tableCriteria: any;
  providedData?: T[];
  rootCustomStyle?: any;
  normalizrSchema?: schema.Entity | schema.Entity[];
}

// Document List Landing Paging Grid Columns
export interface DocumentListColumnsInterface {
  field: string;
  title: string;
  show: boolean;
  showColumnMenu?: boolean;
  format?: any; // TODO Check
  filter?: "boolean" | "numeric" | "text" | "date" | undefined;
  groupable: boolean;
  filterCell?: any; // TODO: FIND TYPE FOR TEMPLATE
  cell?: any; // TODO: FIND TYPE FOR TEMPLATE
  locked?: boolean;
  width?: any;
  columnMenu?: any; // TODO: FIND TYPE FOR TEMPLATE
  orderIndex?: number;
}
