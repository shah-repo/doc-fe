import { combineReducers } from "redux";
import { SELECT_COMPANY } from "../company/constants";
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET, TABLE_SORT } from "./constants";
import {
  TableSearchByIdState,
  TableSearchClearAction,
  TableSearchSetAction,
  TableSortAction,
} from "./types";

export const DEFAULT_TABLE_SEARCH = {
  queryData: [],
  queryDict: {},
  apiError: "",
  scrollToIndex: 0,
};

type TableSearchActions = TableSearchSetAction<any> &
  TableSearchClearAction &
  TableSortAction<any>;

export const byTableName = (
  state: TableSearchByIdState = {},
  action: TableSearchActions,
): TableSearchByIdState => {
  switch (action.type) {
    case TABLE_SEARCH_SET:
      return {
        ...state,
        [action.tableName]: action.payload,
      };
    case TABLE_SEARCH_CLEAR:
      return {
        ...state,
        [action.tableName]: DEFAULT_TABLE_SEARCH,
      };
    case TABLE_SORT:
      return {
        ...state,
        [action.tableName]: action.payload,
      };
    case SELECT_COMPANY:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  byTableName,
});
