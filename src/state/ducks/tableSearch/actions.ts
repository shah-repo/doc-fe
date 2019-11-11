import { TablePanelStateProps } from '../../../ui/components/table/types';
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET, TABLE_SORT } from './constants';
import {
  TableSearchClearAction,
  TableSearchSetAction,
  TableSortAction,
} from './types';

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

export default {
  setTableSort,
  setSearchCriteria,
  clearSearchCriteria,
};
