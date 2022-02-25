import { DataResult, State } from "@progress/kendo-data-query";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { KendoColumn } from "../../components/common/kendo/types";
import { TablePanelStateProps } from "../../components/table/types";

export interface FilterList {
  field: string;
  operator: string;
  value: any;
}

export interface FilterObject {
  logic: "and";
  filters: FilterList[];
}
export interface DataStateProps {
  filter: FilterObject;
  take: number;
  skip: number;
  sort: any[];
  group: any[];
}

export interface KendoPresenterProps {
  statuses: DocumentRevisionStatus | DocumentRevisionStatus[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  columns: KendoColumn[];
  onRowClick: ((dataItem: any) => void);
}

export interface KendoGridProps<T> {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[];
  exportDataChanges?: (data: T[]) => void;
  onRowClick: ((dataItem: any) => void);
}

export interface DataLoaderProps {
  dataState: State;
  onDataReceived: (products: DataResult) => void;
  schema: object;
  tableName: string;
  tableCriteria: TablePanelStateProps;
}

export interface KendoTableSearchQueryType {
  [key: string]: any;
}
