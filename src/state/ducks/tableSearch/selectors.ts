import { ApplicationState } from "../../reducers";
import { DEFAULT_TABLE_SEARCH } from "./reducers";

const byTableName = (state: ApplicationState) => state.tableSearch.byTableName;
const getTableState = (state: ApplicationState, tableName: string) =>
  byTableName(state)[tableName] || DEFAULT_TABLE_SEARCH;

export default {
  getTableState,
};
