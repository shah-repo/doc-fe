import { TablePanelStateProps } from "../../../ui/components/table/types";
import { TABLE_SEARCH_CLEAR, TABLE_SEARCH_SET } from "./constants";

export interface TableSearchSetAction<T> {
  type: typeof TABLE_SEARCH_SET;
  payload: TablePanelStateProps<T>;
  tableName: string;
}

export interface TableSearchClearAction {
  type: typeof TABLE_SEARCH_CLEAR;
  tableName: string;
}

export interface TableSearchByIdState {
  [key: string]: TablePanelStateProps<any>;
}
