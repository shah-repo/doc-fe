import { AUTH_TOKENS, AUTH_USER, LOGOUT_USER } from "./constants";
import { tokens, TOKENS_DEFAULT_STATE, user, USER_DEFAULT_STATE } from "./reducers";
import { AuthTokensAction, AuthTokensPayload, AuthUserAction, AuthUserPayload, LogoutUserAction } from "./types";

describe("tokens reducer tests", () => {
  const payload: AuthTokensPayload = {
    tokens: {
      id: { value: "ID", expiresAt: "124124" },
      access: { value: "ACCESS", expiresAt: "124124" },
      refresh: { value: "REFRESH", expiresAt: "124124" },
    },
  };

  it("sets new tokens", () => {
    const action: AuthTokensAction = { type: AUTH_TOKENS, payload };

    expect(tokens(undefined, action)).toEqual(payload.tokens);
  });

  it("resets state on user logout", () => {
    const action: LogoutUserAction = { type: LOGOUT_USER };

    expect(tokens(undefined, action)).toEqual(TOKENS_DEFAULT_STATE);
  });
});

describe("user reducer tests", () => {
  const payload: AuthUserPayload = {
    email: "dino@codecons.com",
    id: "1",
    name: "Dino",
  };

  it("sets user email", () => {
    const action: AuthUserAction = { type: AUTH_USER, payload };

    expect(user(undefined, action)).toEqual({
      email: payload.email,
      id: payload.id,
      name: payload.name,
    });
  });

  it("resets state on user logout", () => {
    const action: LogoutUserAction = { type: LOGOUT_USER };

    expect(user(undefined, action)).toEqual(USER_DEFAULT_STATE);
  });
});
