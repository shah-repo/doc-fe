import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const isAuthenticated = (state: ApplicationState): boolean => {
  return Boolean(state.auth.tokens.id.value);
};

const currentUserEmail = (state: ApplicationState): string => {
  return state.auth.user.email;
};

const accessToken = (state: ApplicationState): string => {
  return state.auth.tokens.access.value;
};

const loginFormAsyncStatus = (state: ApplicationState): AsyncState => {
  return state.auth.loginFormAsyncStatus;
};

export default {
  isAuthenticated,
  loginFormAsyncStatus,
  currentUserEmail,
  accessToken,
};
