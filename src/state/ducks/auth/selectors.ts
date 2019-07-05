import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const isAuthenticated = (state: ApplicationState): boolean => {
  return Boolean(state.auth.tokens.id.value);
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

const accessToken = (state: ApplicationState): string => {
  return state.auth.tokens.access.value;
};

const getLoadPermissionsAsyncState = (state: ApplicationState): AsyncState => {
  return state.auth.loadPermissionsAsyncInfo;
};

export default {
  isAuthenticated,
  currentUserEmail,
  accessToken,
  currentUserName,
  currentUserId,
  getLoadPermissionsAsyncState,
};
