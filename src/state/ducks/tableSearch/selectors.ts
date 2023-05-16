import { ApplicationState } from '../../reducers';
import { DEFAULT_TABLE_SEARCH } from './reducers';

const criteria = (state: ApplicationState) => state.tableSearch.criteria;
const data = (state: ApplicationState) => state.tableSearch.data;
const getTableCriteria = (state: ApplicationState, tableName: string) =>
  criteria(state)[tableName] || DEFAULT_TABLE_SEARCH;
const getTableData = (state: ApplicationState, tableName: string) =>
  data(state)[tableName] || [];

export default {
  getTableCriteria,
  getTableData,
};
