import { schema } from "normalizr";
import { ActionCreator } from "redux";
import { ApiAction } from "../../../state/types";
import { KendoPanelProps } from "../../components/common/kendo/types";
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
  hasDropboxPermission: boolean;
  dropboxAsync?: any;
  enableDropboxAction?: any;
  isCompanyDropboxEnabled?: boolean;
  tableCriteria?: any;
}

export interface TableSelectionProps<T> {
  dataItem: T;
  actionType?: TableColumnActionType;
}

export interface UserManage {
  id?: string;
  name?: string;
  email?: string;
  groups?: string[];
  active?: boolean | string;
  confirmed?: boolean | string;
  inEdit?: boolean | string;
  groupsOrg?: string[];
}

export interface UserManagementProps<T> extends KendoPanelProps<T>{
  onSelect: any; // TableSelectionRenderer<T>;
  hasDropboxPermission: boolean;
  dropboxAsync: any;
  enableDropboxAction: ActionCreator<ApiAction<any, any>>;
  isCompanyDropboxEnabled: boolean | undefined;
}
