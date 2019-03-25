import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import _ from "lodash";
import { Action, Dispatch, Middleware, Store } from "redux";
import Config from "../../../config";
import apiInstance from "../../apiClient";
import { apiAction } from "../../factories";
import { ApplicationState } from "../../reducers";
import initialStoreState from "../../tests/helpers/initialStoreState";
import { ApiAction, AsyncAction, AsyncStatus } from "../../types";
import api from "../api";
import middlewareMockStore from "../tests/helpers/middlewareMockStore";
import refreshTokenOperation from "./refreshToken";

const apiMock = new MockAdapter(apiInstance);

jest.mock("./refreshToken", () => jest.fn().mockImplementation(() => Promise.resolve()));

describe("api middleware test", () => {
  const asyncType = "TEST_ASYNC";

  let store: Partial<Store>;
  let next: Dispatch;
  let invoke: (action: Action) => Middleware;
  let defaultState: ApplicationState;
  let requestConfig: AxiosRequestConfig;

  const mockResponse = {
    message: "test",
  };

  const mockResponseError = {
    error: ["error1", "error2"],
  };

  const mockResponseErrorString = {
    error: "error",
  };

  beforeAll(() => {
    apiMock.onGet("/test").reply((config: AxiosRequestConfig) => {
      requestConfig = config;
      return [200, mockResponse];
    });
    apiMock.onGet("/error").reply(400, mockResponseError);
    apiMock.onGet("/errorString").reply(400, mockResponseErrorString);
  });

  afterAll(() => {
    apiMock.reset();
    apiMock.restore();
  });

  it("calls next function if action is not api action", async () => {
    ({ next, invoke } = middlewareMockStore(api));
    const action = { type: "test not api action" };
    await invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  describe("when call is successful", () => {
    const ID_TOKEN = "ID_TOKEN";

    const onSuccess = jest.fn();
    const onCompleted = jest.fn();
    const onFailure = jest.fn();
    const dispatchCalls: any[] = [];

    let action: ApiAction;

    beforeAll(async () => {
      requestConfig = {};

      (refreshTokenOperation as jest.Mock).mockClear();

      const state = _.cloneDeep(initialStoreState);
      state.auth.tokens.id.value = ID_TOKEN;

      ({ store, next, invoke, defaultState } = middlewareMockStore(api, state));

      action = apiAction({
        asyncType,
        includeAuthorization: true,
        url: "/test",
        onSuccess,
        onCompleted,
        onFailure,
        data: { testData: true },
        params: { testParams: true },
      });

      await invoke(action);

      dispatchCalls.push(...(store.dispatch as jest.Mock).mock.calls);
    });

    it("dispatches async Active status", () => {
      const expectedAction: AsyncAction = {
        type: asyncType,
        payload: {
          status: AsyncStatus.Active,
          message: "",
        },
      };

      expect(dispatchCalls[0][0]).toEqual(expectedAction);
    });

    it("calls refreshToken function", () => {
      expect(refreshTokenOperation).toHaveBeenCalledWith(store.dispatch, defaultState);
    });

    it("sets Authorization in request headers", () => {
      expect(requestConfig.headers).toMatchObject({ Authorization: ID_TOKEN });
    });

    it("correctly configured axios requst", () => {
      expect(requestConfig).toMatchObject({
        data: JSON.stringify(action.data),
        method: action.method || "get",
        params: action.params,
        url: `${Config.ApiEndpoint}${action.url}`,
        headers: expect.objectContaining({
          Authorization: ID_TOKEN,
        }),
      });
    });

    it("dispatches async Success status", () => {
      const expectedAction: AsyncAction = {
        type: asyncType,
        payload: {
          status: AsyncStatus.Success,
          message: "",
        },
      };

      expect(dispatchCalls[1][0]).toEqual(expectedAction);
    });

    it("calls onSuccess handler", () => {
      expect(onSuccess).toHaveBeenCalledWith(mockResponse, store.dispatch);
    });

    it("calls onCompleted handler", () => {
      expect(onCompleted).toHaveBeenCalledWith(store.dispatch);
    });

    it("did not call onFailure handler", () => {
      expect(onFailure).not.toHaveBeenCalled();
    });
  });

  describe("when call fails", () => {
    const onSuccess = jest.fn();
    const onCompleted = jest.fn();
    const onFailure = jest.fn();
    const dispatchCalls: any[] = [];

    beforeAll(async () => {
      (refreshTokenOperation as jest.Mock).mockClear();
      ({ store, next, invoke, defaultState } = middlewareMockStore(api));

      await invoke(apiAction({
        asyncType,
        includeAuthorization: false,
        url: "/error",
        onSuccess,
        onCompleted,
        onFailure,
      }));

      dispatchCalls.push(...(store.dispatch as jest.Mock).mock.calls);
    });

    it("dispatches async Active status", () => {
      const expectedAction: AsyncAction = {
        type: asyncType,
        payload: {
          status: AsyncStatus.Active,
          message: "",
        },
      };

      expect(dispatchCalls[0][0]).toEqual(expectedAction);
    });

    it("did not call refreshToken function since includeAuthorization flag is false", () => {
      expect(refreshTokenOperation).not.toHaveBeenCalled();
    });

    it("dispatches async Error status", () => {
      const expectedAction: AsyncAction = {
        type: asyncType,
        payload: {
          status: AsyncStatus.Error,
          message: mockResponseError.error.join("; "),
        },
      };

      expect(dispatchCalls[1][0]).toEqual(expectedAction);
    });

    it("calls onFailure handler", () => {
      expect(onFailure).toHaveBeenCalledWith(mockResponseError.error.join("; "), store.dispatch);
    });

    it("calls onCompleted handler", () => {
      expect(onCompleted).toHaveBeenCalledWith(store.dispatch);
    });

    it("did not call onSuccess handler", () => {
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it("correctly handles error as string", async () => {
    ({ store, next, invoke, defaultState } = middlewareMockStore(api));

    const onFailure = jest.fn();

    await invoke(apiAction({
      asyncType,
      url: "/errorString",
      onFailure,
      includeAuthorization: false,
    }));

    const expectedAction: AsyncAction = {
      type: asyncType,
      payload: {
        status: AsyncStatus.Error,
        message: mockResponseErrorString.error,
      },
    };

    expect(onFailure).toHaveBeenCalledWith(mockResponseErrorString.error, store.dispatch);
    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it("does not dispatch async actions when asyncType is not defined", async () => {
    ({ store, next, invoke, defaultState } = middlewareMockStore(api));

    await invoke(apiAction({ url: "/test", includeAuthorization: false }));

    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it("sets correct content type", async () => {
    requestConfig = {};
    ({ store, next, invoke, defaultState } = middlewareMockStore(api));

    await invoke(apiAction({ url: "/test", includeAuthorization: false, contentType: "multipart/form-data" }));

    expect(requestConfig.headers["Content-Type"]).toEqual("multipart/form-data");
  });
});
