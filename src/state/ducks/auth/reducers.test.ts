import { AUTH_USER, LOGOUT_USER } from "./constants";
import { user, USER_DEFAULT_STATE } from "./reducers";
import { AuthUserAction, AuthUserPayload, LogoutUserAction } from "./types";

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
