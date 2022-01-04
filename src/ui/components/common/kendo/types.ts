import { ColumnSortSettings } from "@progress/kendo-react-data-tools";
import { GridPagerSettings } from "@progress/kendo-react-grid";
import { schema } from "normalizr";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";

interface KendoTableSearchQueryType {
  [key: string]: any;
}

export enum KendoCellTemplates {
  USER_AVATAR="UserAvatar",
  STATUS="Status",
  DATE_COMPLETED="DateCompleted",
  DATE_INFO="DateInfo",
  COMMON_CELL="CommonCell"
}
export interface KendoColumn {
  sortable?: ColumnSortSettings | undefined;
  field: string;
  title: string;
  show: boolean;
  showColumnMenu?: boolean;
  format?: string;
  filter?: "boolean" | "numeric" | "text" | "date" | undefined;
  groupable?: boolean;
  filterCell?: any;
  cell?: any;
  locked?: boolean;
  width?: number | string | undefined;
  reorderable?: boolean;
  orderIndex?: number | undefined;
  columnMenu?: any;
  filterable?: boolean;
  resizable?: boolean;
  disabled?: boolean;
}

export interface DropdownFilterDefaultItem {
  text: string;
  value: string;
}

export interface GridDropDownSettings {
  text: string;
  value: boolean;
}

export interface PageState {
  skip: number;
  take: number;
  group?: any[];
}

export interface KendoGridConfiguration {
  groupableFields?: string[];
  columns: KendoColumn[];
  pagerSettings: GridPagerSettings;
  initialDataState? : PageState;
  booleanFilterCellOptions? : GridDropDownSettings[];
}

export interface KendoGridCriteria {
  queryDict: KendoTableSearchQueryType;
  apiError: string;
  forceUpdate: boolean;
  kendoConfig?: string;
  columnConfig?: string;
}

export interface DocumentTypeOptions{
  text: string;
  value: string;
}

export interface KendoPanelProps<T> {
  gridConfiguration: KendoGridConfiguration;
  tableName: string;
  gridData: T[];
  tableCriteria: KendoGridCriteria;
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[];
  queryUrl?: string;
  customQuerySet?: (queryDict: KendoTableSearchQueryType) => KendoTableSearchQueryType;
  customDataSet?: (data: T[]) => T[];
  providedData?: T[];
  normalizrSchema?: schema.Entity | schema.Entity[];
  editDocumentRevision?: (documentRevisionId: string, documentId: string) => void;
  rootCustomStyle?: any;
  previewDocumentRevision?: (documentRevisionId: string, documentId: string) => void;
  documentTypeOptions?: DocumentTypeOptions[];
}

