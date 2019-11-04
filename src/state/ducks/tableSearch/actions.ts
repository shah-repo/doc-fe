import { TablePanelStateProps } from "../../../ui/components/table/types";
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET } from "./constants";
import { TableSearchClearAction, TableSearchSetAction } from "./types";

const setSearchCriteria = <T>(searchCriteria: TablePanelStateProps<T>, tableName: string): TableSearchSetAction<T> => ({
  type: TABLE_SEARCH_SET,
  payload: searchCriteria,
  tableName,
});

const clearSearchCriteria = (tableName: string): TableSearchClearAction => ({
  type: TABLE_SEARCH_CLEAR,
  tableName,
});

export default {
  setSearchCriteria,
  clearSearchCriteria,
};
