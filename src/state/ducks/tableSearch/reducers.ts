import { combineReducers } from "redux";
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET } from "./constants";
import { TableSearchByIdState, TableSearchClearAction, TableSearchSetAction } from "./types";

export const DEFAULT_TABLE_SEARCH = {
  queryData: [],
  queryDict: {},
  apiError: "",
  scrollToIndex: 0,
};

type TableSearchActions = TableSearchSetAction<any> & TableSearchClearAction;

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
    default:
      return state;
  }
};

export default combineReducers({
  byTableName,
});
