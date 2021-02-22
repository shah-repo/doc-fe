import {
  TableDataSetAction,
  TableSearchClearAction,
  TableSearchClearAllAction,
  TableSearchForceUpdateAction,
  TableSearchSetAction,
  TableSortAction, TABLE_CLEAR_ALL,
  TABLE_DATA_SET,
  TABLE_FORCE_UPDATE_SET,
  TABLE_SEARCH_CLEAR,
  TABLE_SEARCH_SET,
  TABLE_SORT,
} from ".";
import { TableDataProps, TablePanelStateProps } from "../../../ui/components/table/types";

const setSearchCriteria = (
  searchCriteria: Partial<TablePanelStateProps>,
  tableName: string,
): TableSearchSetAction => ({
  type: TABLE_SEARCH_SET,
  payload: searchCriteria,
  tableName,
});

const clearSearchCriteria = (tableName: string): TableSearchClearAction => ({
  type: TABLE_SEARCH_CLEAR,
  tableName,
});

const setTableSort = (
  tableData: TablePanelStateProps,
  tableName: string,
): TableSortAction => ({
  type: TABLE_SORT,
  payload: tableData,
  tableName,
});

const setForceUpdate = (tableName: string, forceUpdate: boolean): TableSearchForceUpdateAction => ({
  type: TABLE_FORCE_UPDATE_SET,
  tableName,
  forceUpdate,
});

const setData = <T>(
  data: TableDataProps<T>,
  tableName: string,
): TableDataSetAction<T> => ({
  type: TABLE_DATA_SET,
  payload: data,
  tableName,
});

const clearAllTables = (): TableSearchClearAllAction => ({
  type: TABLE_CLEAR_ALL,
});

export default {
  setTableSort,
  setSearchCriteria,
  clearSearchCriteria,
  setForceUpdate,
  setData,
  clearAllTables,
};
