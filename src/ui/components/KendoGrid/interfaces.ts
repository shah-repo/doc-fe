import { DataResult, State } from "@progress/kendo-data-query";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { KendoColumn } from "../../components/common/kendo/types";
import { TablePanelStateProps } from "../../components/table/types";

interface FilterList {
  field: string;
  operator: string;
  value: any;
}

interface FilterObject {
  logic: "and";
  filters: FilterList[];
}

interface SortObject {
  field: string;
  dir: "asc" | "desc";
}
interface GroupObject {
  field: string;
  dir?: "asc" | "desc";
}
export interface DataStateProps {
  filter: FilterObject;
  take: number;
  skip: number;
  sort: SortObject[];
  group: GroupObject[];
}

export interface KendoPresenterProps {
  statuses: DocumentRevisionStatus | DocumentRevisionStatus[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  columns: KendoColumn[];
  onRowClick: ((dataItem: any) => void);
  queryUrl: string;
}

export interface KendoGridProps<T> {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[];
  exportDataChanges: (data: T[]) => void;
  onRowClick: ((dataItem: any) => void);
  queryUrl: string;
  defaultPayloadData: object;
  documentTypeCategory?: string;
}

export interface DataLoaderProps {
  dataState: State;
  onDataReceived: (products: DataResult, dataState: State) => void;
  schema: object;
  tableName: string;
  queryUrl: string;
  defaultPayloadData: object;
  documentTypeCategory?: string;
  tableCriteria: TablePanelStateProps;
}

export enum KendoGridFilterCell {
  ACTIVE="active",
  DISPLAY_STATUS="displayStatus",
  PO_STATUS="poStatus",
  DOCUMENT_TYPE_ACRONYM= "document.documentType.documentTypeAcronym",
  EFFECTIVE_DATE="effectiveDate",
  COMPLETED_AT="completedAt",
  DUE_ON= "dueOn",
  CREATED_AT= "createdAt",
  RELEASED_AT = "releasedAt",
  STATE = "state",
  TASKTYPE = "taskType",
  STATUS = "status",
  ASYNC_CREATED_AT = "createdAtt"
}

export enum KendoGridFilterCellOperators {
  CONTAINS = "contains",
  DOES_NOT_CONTAIN = "doesnotcontain",
  EQ = "eq",
  NEQ = "neq",
  STARTS_WITH = "startswith",
  ENDS_WITH = "endswith",
  IS_NULL = "isnull",
  IS_NOT_NULL = "isnotnull",
  IS_EMPTY = "isempty",
  IS_NOT_EMPTY = "isnotempty",
}
