import { DocumentType, PageDetails } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { KendoColumn } from "../../components/common/kendo/types";
import { TableColumnProps } from "../../components/table/column/types";
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
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  columns: KendoColumn[];
  headerColumns: TableColumnProps<DocumentRevision>[];
  onRowClick: ((dataItem: any) => void);
  title?: string;
  queryUrl: string;
  documentTypeCategory?: string;
  isByCategory: boolean;
  documentType: DocumentType;
  documentCategory: PageDetails;
}
