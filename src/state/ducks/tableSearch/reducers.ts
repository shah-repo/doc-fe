import { combineReducers } from "redux";
import { USERS_ME_URL } from "../auth/constants";
import { User } from "../auth/types";
import { SELECT_COMPANY } from "../company/constants";
import { GetEmployeeResponse } from "../userManagement";
import {
  EDIT_EMPLOYEE_ACTIVE_STATUS,
  EDIT_EMPLOYEE_GROUPS,
  EDIT_EMPLOYEE_USER_INFO,
  TABLE_DATA_SET,
  TABLE_FORCE_UPDATE_SET,
  TABLE_SEARCH_CLEAR,
  TABLE_SEARCH_SET,
  TABLE_SORT,
} from "./constants";
import {
  EditActiveStatusAction,
  TableDataSetAction,
  TableSearchByIdState,
  TableSearchClearAction,
  TableSearchDataState,
  TableSearchForceUpdateAction,
  TableSearchSetAction,
  TableSortAction,
} from "./types";

export const DEFAULT_TABLE_SEARCH = {
  queryData: [],
  queryDict: {},
  apiError: "",
  scrollToIndex: 0,
  forceUpdate: false,
};
type TableSearchActions = TableSearchSetAction &
  TableSearchClearAction &
  TableSearchForceUpdateAction &
  TableSortAction;

type TableDataActions = TableDataSetAction<any> & EditActiveStatusAction;

export const criteria = (
  state: TableSearchByIdState = {},
  action: TableSearchActions,
): TableSearchByIdState => {
  switch (action.type) {
    case TABLE_FORCE_UPDATE_SET:
      return {
        ...state,
        [action.tableName]: {
          ...state[action.tableName],
          forceUpdate: action.forceUpdate,
        },
      };
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

export const data = (
  state: TableSearchDataState = {},
  action: TableDataActions,
): TableSearchDataState => {
  switch (action.type) {
    case TABLE_DATA_SET:
      return {
        ...state,
        [action.tableName]: action.payload,
      };
    case EDIT_EMPLOYEE_GROUPS:
    case EDIT_EMPLOYEE_ACTIVE_STATUS:
      if (!state.userManagement) {
        return state;
      }
      const list = state.userManagement.map(
        (employee: GetEmployeeResponse) => {
          const { payload: updatedEmployee } = action;

          if (
            employee.id ===
            ((updatedEmployee as unknown) as GetEmployeeResponse).id
          ) {
            return {
              ...action.payload,
            };
          }

          return employee;
        },
      );

      return {
        ...state,
        userManagement: list,
      };
    case EDIT_EMPLOYEE_USER_INFO:
    case USERS_ME_URL:
      if (!state.userManagement) {
        return state;
      }
      const employees = state.userManagement.map(
        (employee: GetEmployeeResponse) => {
          const { payload: updatedEmployee } = action;
          if (
            employee.user.id === ((updatedEmployee as unknown) as User).id
          ) {
            return {
              ...employee,
              user: {
                ...employee.user,
                name: ((updatedEmployee as unknown) as User).name,
                avatar: ((updatedEmployee as unknown) as User).avatar,
              },
            };
          }

          return employee;
        },
      );

      return {
        ...state,
        userManagement: employees,
      };
    case SELECT_COMPANY:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  criteria,
  data,
});
