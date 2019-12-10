import { TablePanelStateProps } from "../../../ui/components/table/types";
import { GetEmployeeResponse } from "../userManagement";
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET, TABLE_SET_GROUPS, TABLE_SORT } from "./constants";

export interface TableSearchSetAction<T> {
  type: typeof TABLE_SEARCH_SET;
  payload: TablePanelStateProps<T>;
  tableName: string;
}

export interface TableSearchClearAction {
  type: typeof TABLE_SEARCH_CLEAR;
  tableName: string;
}

export interface TableSortAction<T> {
  type: typeof TABLE_SORT;
  payload: TablePanelStateProps<T>;
  tableName: string;
}

export interface TableSearchByIdState {
  [key: string]: TablePanelStateProps<any>;
}

export interface EditGroupsAction {
  type: typeof TABLE_SET_GROUPS;
  payload: GetEmployeeResponse;
}
