import { schema } from "normalizr";
import {
  TableSearchQueryType,
  TableSelectionRenderer,
} from "../../components/table/types";
import { Translation } from "../../translations/types";

export interface KendoPanelProps<T> {
  columns: any;
  statuses: any;
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
  currentUserEmail?: any;
}
