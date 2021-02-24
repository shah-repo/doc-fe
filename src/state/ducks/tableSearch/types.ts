import { TableDataProps, TablePanelStateProps } from "../../../ui/components/table/types";
import { User } from "../auth/types";
import { GetEmployeeResponse } from "../userManagement/types";
import {
  EDIT_EMPLOYEE_ACTIVE_STATUS,
  EDIT_EMPLOYEE_GROUPS,
  EDIT_EMPLOYEE_USER_INFO,
  TABLE_CLEAR_ALL,
  TABLE_DATA_SET,
  TABLE_FORCE_UPDATE_SET,
  TABLE_SEARCH_CLEAR,
  TABLE_SEARCH_SET,
  TABLE_SORT
} from "./constants";

export interface TableSearchSetAction {
  type: typeof TABLE_SEARCH_SET;
  payload: Partial<TablePanelStateProps>;
  tableName: string;
}

export interface TableDataSetAction<T> {
  type: typeof TABLE_DATA_SET;
  payload: TableDataProps<T>;
  tableName: string;
}

export interface TableSearchClearAction {
  type: typeof TABLE_SEARCH_CLEAR;
  tableName: string;
}

export interface TableSearchClearAllAction {
  type: typeof TABLE_CLEAR_ALL;
}

export interface TableSearchForceUpdateAction {
  type: typeof TABLE_FORCE_UPDATE_SET;
  tableName: string;
  forceUpdate: boolean;
}

export interface TableSortAction {
  type: typeof TABLE_SORT;
  payload: TablePanelStateProps;
  tableName: string;
}

export interface TableSearchByIdState {
  [key: string]: TablePanelStateProps;
}

export interface TableSearchDataState {
  [key: string]: TableDataProps<any>;
}

export interface EditGroupsAction {
  type: typeof EDIT_EMPLOYEE_GROUPS;
  payload: GetEmployeeResponse;
}

export interface EditActiveStatusAction {
  type: typeof EDIT_EMPLOYEE_ACTIVE_STATUS;
  payload: GetEmployeeResponse;
}

export interface EditUserInfoAction {
  type: typeof EDIT_EMPLOYEE_USER_INFO;
  payload: User;
}
