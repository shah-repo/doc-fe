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

