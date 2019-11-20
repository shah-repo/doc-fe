import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import {
  AUTH_USER,
  LOGOUT_USER,
  SET_EMPLOYEE,
  USER_PERMISSIONS,
  USER_PERMISSIONS_GET_ASYNC,
} from "./constants";
import {
  AuthUserAction,
  LogoutUserAction,
  SelectEmployeeAction,
  UserPermissionsAction,
  UserPermissionsState,
  UserState,
} from "./types";

export const USER_DEFAULT_STATE: UserState = {
  email: "",
  name: "",
  id: "",
  employeeId: "",
  sessionId: "",
  employees: [],
};

type AuthUserActions = AuthUserAction | LogoutUserAction | SelectEmployeeAction;

export const user = (state: UserState = USER_DEFAULT_STATE, action: AuthUserActions): UserState => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        email: action.payload.email,
        name: action.payload.name,
        id: action.payload.id,
        employeeId: action.payload.employeeId,
        sessionId: action.payload.sessionId,
        employees: action.payload.employees,
      };
    case SET_EMPLOYEE:
      return {
        ...state,
        employeeId: action.payload.id,
      };
    case LOGOUT_USER:
      return { ...USER_DEFAULT_STATE };
    default:
      return state;
  }
};

export const USER_PERMISSIONS_DEFAULT_STATE: UserPermissionsState = [];

export const permissions = (
  state: UserPermissionsState = USER_PERMISSIONS_DEFAULT_STATE,
  action: UserPermissionsAction,
): UserPermissionsState => {
  switch (action.type) {
    case USER_PERMISSIONS:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  user,
  loadPermissionsAsyncInfo: asyncReducer(USER_PERMISSIONS_GET_ASYNC),
  permissions,
});

export default reducer;
