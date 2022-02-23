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
}

export interface KendoPanelProps {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  columns: KendoColumn[];
  statuses: DocumentRevisionStatus | DocumentRevisionStatus[];
}

export interface ProductsLoaderProps {
  dataState: State;
  onDataReceived: (products: DataResult) => void;
  schema: object;
  tableName: string;
}

export interface KendoTableSearchQueryType {
  [key: string]: any;
}
