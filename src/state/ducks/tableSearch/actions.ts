import { TablePanelStateProps } from "../../../ui/components/table/types";
import { User } from "../common";
import { GetEmployeeResponse } from "../userManagement";
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET, TABLE_SET_GROUPS, TABLE_SET_USER_INFO, TABLE_SORT } from "./constants";
import {
  EditGroupsAction,
  EditUserInfoAction,
  TableSearchClearAction,
  TableSearchSetAction,
  TableSortAction,
} from "./types";

const setSearchCriteria = <T>(
  searchCriteria: TablePanelStateProps<T>,
  tableName: string,
): TableSearchSetAction<T> => ({
  type: TABLE_SEARCH_SET,
  payload: searchCriteria,
  tableName,
});

const clearSearchCriteria = (tableName: string): TableSearchClearAction => ({
  type: TABLE_SEARCH_CLEAR,
  tableName,
});

const setTableSort = <T>(
  tableData: TablePanelStateProps<T>,
  tableName: string,
): TableSortAction<T> => ({
  type: TABLE_SORT,
  payload: tableData,
  tableName,
});

const editEmployee = (employee: GetEmployeeResponse): EditGroupsAction => {
  return {
    type: TABLE_SET_GROUPS,
    payload: employee,
  };
};

const editEmployeeUserInfo = (user: User): EditUserInfoAction => {
  return {
    type: TABLE_SET_USER_INFO,
    payload: user,
  };
};
export default {
  setTableSort,
  setSearchCriteria,
  clearSearchCriteria,
  editEmployee,
  editEmployeeUserInfo,
};
