import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const isAuthenticated = (state: ApplicationState): boolean => {
  return Boolean(state.auth.user.sessionId && state.auth.user.employeeId);
};

const currentUserEmail = (state: ApplicationState): string => {
  return state.auth.user.email;
};

const currentUserName = (state: ApplicationState): string => {
  return state.auth.user.name;
};

const currentUserId = (state: ApplicationState): string => {
  return state.auth.user.id;
};

const getLoadPermissionsAsyncState = (state: ApplicationState): AsyncState => {
  return state.auth.loadPermissionsAsyncInfo;
};

const getHasPermission = (
  state: ApplicationState,
  permission: string,
): boolean => state.auth.permissions.includes(permission);

const makeGetHasPermission = () => {
  return createSelector(
    getHasPermission,
    (hasPermission: boolean) => hasPermission,
  );
};

const companys = (state: ApplicationState) => state.auth.user.employees;

export default {
  isAuthenticated,
  currentUserEmail,
  currentUserName,
  currentUserId,
  getLoadPermissionsAsyncState,
  makeGetHasPermission,
  companys,
};
