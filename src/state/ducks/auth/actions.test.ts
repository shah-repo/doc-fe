import { getCallbackHandler } from "../../../common/tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import { Handlers } from "../../types";
import authActions from "./actions";
import {
  LOGIN_URL,
  LOGIN_WITH_CODE_URL,
  LOGOUT_URL,
} from "./constants";
import { getAuthResponse } from "./tests/factories";
import {
  AuthResponse,
  LoginRequestBody,
  LoginWithCodeRequestBody,
} from "./types";

describe("login action tests", () => {
  const loginValues: LoginRequestBody = {
    email: "dino@codecons.com",
    password: "very secret",
  };
  const handlers: Handlers = {
    successHandler: getCallbackHandler<{}>(),
    errorHandler: getCallbackHandler<string>(),
  };

  const data: AuthResponse = getAuthResponse();

  const action = authActions.login(loginValues, handlers);

  it("dispatches actions onSuccess", () => {
    const dispatch = jest.fn();

    action.onSuccess(data, dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual(
      authActions.authUser({
        email: loginValues.email,
        name: data.name,
        id: data.id,
        sessionId: data.sessionId,
        employeeId: data.employees[0].id,
        employees: data.employees,
        avatar: data.avatar,
      }),
    );
  });

  it("calls POST on LOGIN_URL", () => {
    expect(action.url).toBe(LOGIN_URL);
    expect(action.method).toBe("post");
  });
});

describe("loginWithCode action tests", () => {
  const loginValues: LoginWithCodeRequestBody = {
    code: "TOP SECRET!",
  };

  const handlers: Handlers = {
    successHandler: getCallbackHandler<{}>(),
    errorHandler: getCallbackHandler<string>(),
  };

  const response: AuthResponse = getAuthResponse();

  const action = authActions.loginWithCode(loginValues, handlers);

  it("dispatches actions onSuccess", () => {
    const dispatch = jest.fn();

    action.onSuccess(response, dispatch);

    expect(dispatch.mock.calls[0][0]).toEqual(
      authActions.authUser({
        email: response.email,
        name: response.name,
        id: response.id,
        sessionId: response.sessionId,
        employeeId: response.employees[0].id,
        employees: response.employees,
        avatar: response.avatar,
      }),
    );
  });

  it("dispatches actions onFailure", () => {
    const dispatch = jest.fn();

    action.onFailure("ERROR", dispatch);

    expect(dispatch).toHaveBeenCalledWith(authActions.logoutUser());
  });

  it("calls POST on LOGIN_WITH_CODE_URL", () => {
    expect(action.url).toBe(LOGIN_WITH_CODE_URL);
    expect(action.method).toBe("post");
  });
});

describe("logout action tests", () => {
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
    expect(action.method).toBe("delete");
  });
});
