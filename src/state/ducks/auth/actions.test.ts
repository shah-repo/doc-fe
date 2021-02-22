import faker from "faker";
import {
  AuthResponse,
  EmployeeEditRequestBody, GROUPS_URL, LoginRequestBody,
  LoginWithCodeRequestBody, LOGIN_URL,
  LOGIN_WITH_CODE_URL,
  LOGOUT_URL,
  USERS_ME_URL,
  USERS_URL,
} from ".";
import { getCallbackHandler } from "../../../common/tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import { Handlers } from "../../types";
import { userManagementActions } from "../userManagement";
import { getGroup } from "../userManagement/tests/factories";
import authActions from "./actions";
import { getAuthResponse, getUser } from "./tests/factories";

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
    expect(dispatch.mock.calls[0][0]).toEqual(authActions.authUser(data));
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

    expect(dispatch.mock.calls[0][0]).toEqual(authActions.authUser(response));
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

describe("editCurrentEmployee tests", () => {
  const body: EmployeeEditRequestBody = {
    name: faker.random.word(),
    avatar: null,
  };
  const handlers: Handlers<Partial<AuthResponse>> = {
    successHandler: getCallbackHandler<Partial<AuthResponse>>(),
    errorHandler: getCallbackHandler<string>(),
  };
  const action = authActions.editCurrentEmployee(body, handlers);

  it("calls PATCH on USERS_ME_URL", () => {
    expect(action.url).toBe(`${USERS_ME_URL}`);
    expect(action.method).toBe("patch");
  });

  it("calls dispatch with editUser action on success", () => {
    const dispatch = jest.fn();
    const user = getUser();
    action.onSuccess(user, dispatch);
    expect(dispatch).toHaveBeenLastCalledWith(authActions.editUser(user));
  });
});

describe("editSelectedEmployee tests", () => {
  const id = faker.random.uuid();
  const body: EmployeeEditRequestBody = {
    name: faker.random.word(),
    avatar: null,
  };
  const handlers: Handlers<Partial<AuthResponse>> = {
    successHandler: getCallbackHandler<Partial<AuthResponse>>(),
    errorHandler: getCallbackHandler<string>(),
  };
  const action = authActions.editSelectedEmployee(id, body, handlers);

  it("calls PATCH on USERS_URL/id", () => {
    expect(action.url).toBe(`${USERS_URL}/${id}`);
    expect(action.method).toBe("patch");
  });

  it("calls dispatch with editSelectedEmployeeUserInfo action on success", () => {
    const dispatch = jest.fn();
    const user = getUser();
    action.onSuccess(user, dispatch);
    expect(dispatch).toHaveBeenLastCalledWith(
      userManagementActions.editSelectedEmployeeUserInfo(user),
    );
  });
});

describe("loadUserGroups tests", () => {
  const action = authActions.loadUserGroups();

  it("calls GET on GROUPS_URL", () => {
    expect(action.url).toBe(`${GROUPS_URL}`);
    expect(action.method).toBe("get");
  });

  it("calls dispatch with userGroups action on success", () => {
    const dispatch = jest.fn();
    const groups = [getGroup()];
    action.onSuccess(groups, dispatch);
    expect(dispatch).toHaveBeenLastCalledWith(authActions.userGroups(groups));
  });
});
