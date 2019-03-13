import moment from "moment";
import Config from "../../../config";
import { resetAsyncStateAction } from "../../factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import authActions from "./actions";
import {
  AUTH_TOKENS,
  AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS,
  LOGIN_FORM_ASYNC_STATUS,
  LOGIN_URL,
  LOGOUT_URL,
} from "./constants";
import { AuthResponse, AuthTokensAction, AuthTokensPayload, LoginRequestBody } from "./types";

describe("authTokens action tests", () => {
  const ACCESS_TOKEN = "access token";
  const ID_TOKEN = "abc";
  const REFRESH_TOKEN = "abcdef";
  const EXPIRES_IN = 1000;

  let dateNowSpy: any;
  let action: AuthTokensAction;
  let now: number;

  const authResponse: AuthResponse = {
    IdToken: ID_TOKEN,
    ExpiresIn: EXPIRES_IN,
    RefreshToken: REFRESH_TOKEN,
    AccessToken: ACCESS_TOKEN,
  };

  beforeAll(() => {
    now = Date.now();
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
    action = authActions.authTokens(authResponse);
  });

  afterAll(() => {
    dateNowSpy.mockReset();
    dateNowSpy.mockRestore();
  });

  it("returns action with type key of AUTH_TOKENS", () => {
    expect(action.type).toEqual(AUTH_TOKENS);
  });

  it("contains correct payload", () => {
    const expectedPayload: AuthTokensPayload = {
      tokens: {
        id: {
          value: ID_TOKEN,
          expiresAt: moment(now).add(EXPIRES_IN - AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS, "seconds").toISOString(),
        },
        access: {
          value: ACCESS_TOKEN,
          expiresAt: moment(now).add(EXPIRES_IN - AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS, "seconds").toISOString(),
        },
        refresh: {
          value: REFRESH_TOKEN,
          expiresAt: moment(now).add(Config.RefreshTokenValidityInDays - 1, "days").toISOString(),
        },
      },
    };

    expect(action.payload).toEqual(expectedPayload);
  });

  it("does not contain refresh in payload", () => {
    const { payload } = authActions.authTokens({
      IdToken: ID_TOKEN,
      ExpiresIn: EXPIRES_IN,
      AccessToken: ACCESS_TOKEN,
    });

    expect(payload.tokens.refresh).toBeUndefined();
  });
});

describe("login action tests", async () => {
  const loginValues: LoginRequestBody = {
    email: "dino@codecons.com",
    password: "very secret",
  };

  const data: AuthResponse = {
    IdToken: "TOKEN",
    AccessToken: "ACCESS",
    RefreshToken: "REFRESH",
    ExpiresIn: 3600,
  };

  const action = authActions.login(loginValues);

  it("dispatches actions onSuccess", () => {
    const dispatch = jest.fn();

    action.onSuccess(data, dispatch);

    expect(dispatch.mock.calls[0][0]).toEqual(authActions.authUser({ email: loginValues.email }));
    expect(dispatch.mock.calls[1][0]).toMatchObject({
      type: AUTH_TOKENS,
    });
    expect(dispatch.mock.calls[2][0]).toEqual(resetAsyncStateAction(LOGIN_FORM_ASYNC_STATUS));
  });

  it("calls POST on LOGIN_URL", () => {
    expect(action.url).toBe(LOGIN_URL);
    expect(action.method).toBe("post");
  });
});

describe("logout action tests", async () => {
  const dispatch = jest.fn();
  const getState = () => initialStoreState;
  authActions.logout()(dispatch, getState, null);
  const action = dispatch.mock.calls[0][0];

  it("dispatches logoutUser action when action completes", () => {
    action.onCompleted();
    expect(dispatch).toHaveBeenLastCalledWith(authActions.logoutUser());
  });

  it("calls POST on LOGOUT_URL", () => {
    expect(action.url).toBe(LOGOUT_URL);
    expect(action.method).toBe("post");
  });
});
