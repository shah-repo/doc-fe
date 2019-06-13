import { combineReducers } from "redux";
import { AUTH_TOKENS, AUTH_USER, LOGOUT_USER } from "./constants";
import { AuthTokensAction, AuthUserAction, LogoutUserAction, TokensState, UserState } from "./types";

export const TOKENS_DEFAULT_STATE: TokensState = {
  id: { value: "", expiresAt: "" },
  access: { value: "", expiresAt: "" },
  refresh: { value: "", expiresAt: "" },
};

type AuthTokensActions = AuthTokensAction | LogoutUserAction;

export const tokens = (state: TokensState = TOKENS_DEFAULT_STATE, action: AuthTokensActions): TokensState => {
  switch (action.type) {
    case AUTH_TOKENS:
      return { ...state, ...action.payload.tokens };
    case LOGOUT_USER:
      return { ...TOKENS_DEFAULT_STATE };
    default:
      return state;
  }
};

export const USER_DEFAULT_STATE: UserState = {
  email: "",
  name: "",
};

type AuthUserActions = AuthUserAction | LogoutUserAction;

export const user = (state: UserState = USER_DEFAULT_STATE, action: AuthUserActions): UserState => {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, email: action.payload.email, name: action.payload.name };
    case LOGOUT_USER:
      return { ...USER_DEFAULT_STATE };
    default:
      return state;
  }
};

const reducer = combineReducers({
  tokens,
  user,
});

export default reducer;
