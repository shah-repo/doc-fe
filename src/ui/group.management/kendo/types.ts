import { schema } from "normalizr";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement/types";
import { TableColumnActionType } from "../../components/table/column/types";
import { TableSearchQueryType } from "../../components/table/types";
import { Translation } from "../../translations/types";

export type TableSelectionRenderer<T> = (
  props: TableSelectionProps<T>
) => () => any;

export interface TablePanelProps<T> {
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
  clearFilter?: () => void;
  sortBy?: string;
  customQuerySet?: (queryDict: TableSearchQueryType) => TableSearchQueryType;
  customDataSet?: (data: T[]) => T[];
  tableName: string;
  providedData?: T[];
  rootCustomStyle?: any;
  normalizrSchema?: schema.Entity | schema.Entity[];
  currentUserEmail?: any;
  editGroupsDialog: any;
  selectedGroup: LoadCompanyGroup;
  canCreateGroups: boolean;
}

export interface TableSelectionProps<T> {
  dataItem: T;
  actionType?: TableColumnActionType;
}
