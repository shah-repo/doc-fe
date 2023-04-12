import { GroupDescriptor } from "@progress/kendo-data-query";
import { ColumnSortSettings } from "@progress/kendo-react-data-tools";
import { GridCellProps, GridColumnMenuProps, GridFilterCellProps, GridPagerSettings } from "@progress/kendo-react-grid";
import { schema } from "normalizr";
import { ComponentType } from "react";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import { DTMCellTemplates } from "../../../document.type.management/kendo/config";
import { KendoGridFilterCell } from "../../KendoGrid/interfaces";

interface KendoTableSearchQueryType {
  [key: string]: any;
}

export enum KendoCellTemplates {
  ACTIVE="Active",
  USER_AVATAR="UserAvatar",
  STATUS="Status",
  DATE_COMPLETED="DateCompleted",
  DATE_INFO="DateInfo",
  COMMON_CELL="CommonCell",
  DOCUMENT_TYPE="DocumentTypeCellTemplate",
  DURATION="DurationCell"
}
export interface KendoColumn {
  sortable?: ColumnSortSettings;
  field: string;
  title: string;
  show: boolean;
  showColumnMenu?: boolean;
  format?: string;
  filter?: "boolean" | "numeric" | "text" | "date" ;
  groupable?: boolean;
  filterCell?: ComponentType<GridFilterCellProps> | KendoGridFilterCell | DTMCellTemplates;
  cell?: string;
  locked?: boolean;
  width?: number | string;
  reorderable?: boolean;
  orderIndex?: number;
  columnMenu?: GridColumnMenuProps;
  filterable?: boolean;
  disabled?: boolean;
  resizable?: boolean;
  showTooltip?: boolean;
  tooltipField?: string;
  extraFields?: string[];
  showActionButtons?: boolean;
  minWidth?: number;
  maxWidth?: number;
}
export interface PageState {
  skip: number;
  take: number;
  group?: GroupDescriptor[];
}
export interface KendoGridConfiguration {
  groupableFields?: string[];
  columns: KendoColumn[];
  pagerSettings: GridPagerSettings | boolean;
  initialDataState? : PageState;
}

interface KendoGridCriteria {
  queryDict: KendoTableSearchQueryType;
  apiError: string;
  forceUpdate: boolean;
  kendoConfig?: string;
  columnConfig?: string;
}

interface DocumentTypeOptions{
  text: string;
  value: string;
}

export interface KendoPanelProps<T> {
  gridConfiguration?: KendoGridConfiguration;
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
  previewDocumentRevision?: (documentRevisionId: string, documentId: string) => void;
  documentTypeOptions?: DocumentTypeOptions[];
  currentUserEmail?: string;
  exportDataChanges?: (data: T[]) => void;
}

export interface CustomGridCellProps extends GridCellProps {
  cellRowClick?: ((dataItem: any) => void);
  showTooltip?: boolean;
  tooltipField?: string;
}
