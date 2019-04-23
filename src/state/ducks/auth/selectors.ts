import { ApplicationState } from "../../reducers";

const isAuthenticated = (state: ApplicationState): boolean => {
  return Boolean(state.auth.tokens.id.value);
};

const currentUserEmail = (state: ApplicationState): string => {
  return state.auth.user.email;
};

const accessToken = (state: ApplicationState): string => {
  return state.auth.tokens.access.value;
};

export default {
  isAuthenticated,
  currentUserEmail,
  accessToken,
};
