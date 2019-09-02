import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import _ from "lodash";
import moment from "moment-timezone";
import Config from "../../../config";
import { Translation } from "../../../ui/translations/types";
import api from "../../apiClient";
import { authActions } from "../../ducks/auth";
import { AuthResponse } from "../../ducks/auth/types";
import { ApplicationState } from "../../reducers";
import initialStoreState from "../../tests/helpers/initialStoreState";
import refreshTokenOperation, { REFRESH_TOKEN_URL } from "./refreshToken";
import { TokenRefreshRequestBody } from "./types";

const axiosMock = new MockAdapter(api);

jest.mock("../../ducks/auth/actions", () => ({
  logoutUser: jest.fn().mockImplementation(() => "Logout"),
  authTokens: jest.fn().mockImplementation((data) => data),
}));

describe("refreshToken tests", () => {
  const refreshTokenUrl = `${Config.ApiEndpoint}${REFRESH_TOKEN_URL}`;
  const dispatch = jest.fn();
  let state: ApplicationState;

  afterAll(() => {
    axiosMock.restore();
  });

  beforeEach(() => {
    state = _.cloneDeep(initialStoreState);
  });

  afterEach(() => {
    (authActions.logoutUser as jest.Mock).mockClear();
    (authActions.authTokens as jest.Mock).mockClear();
    axiosMock.reset();
    dispatch.mockClear();
  });

  it("raises exception if user is not logged in", async () => {
    await expect(refreshTokenOperation(dispatch, state))
      .rejects
      .toThrowError("errors.userNotLoggedIn" as Translation);
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      state.auth.tokens.id.value = "IdToken";
      state.auth.tokens.refresh.value = "RefreshToken";
    });

    it("does nothing if id token has not expired", async () => {
      state.auth.tokens.id.expiresAt = moment().add(10, "minutes").toISOString();

      const result = await refreshTokenOperation(dispatch, state);

      expect(result).toEqual("OK");
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("logs user out if refresh token has expired", async () => {
      state.auth.tokens.id.expiresAt = moment().subtract(10, "minutes").toISOString();
      state.auth.tokens.refresh.expiresAt = moment().subtract(1, "minutes").toISOString();

      const result = await refreshTokenOperation(dispatch, state);

      expect(result).toEqual("Token expired");
      expect(dispatch).toHaveBeenCalledWith(authActions.logoutUser());
    });

    describe("when token can be refreshed", () => {
      const mockSuccessResponse: AuthResponse = {
        IdToken: "IdTokenNew",
        AccessToken: "AccessTokenNew",
        ExpiresIn: 3600,
      };

      beforeEach(() => {
        state.auth.tokens.id.expiresAt = moment().subtract(10, "minutes").toISOString();
        state.auth.tokens.refresh.expiresAt = moment().add(100, "minutes").toISOString();
      });

      it("refreshes token", async () => {
        let requestData: any;
        axiosMock.onPost(refreshTokenUrl).reply((config: AxiosRequestConfig) => {
          requestData = config.data;
          return [200, mockSuccessResponse];
        });

        const result = await refreshTokenOperation(dispatch, state);

        const expectedBody: TokenRefreshRequestBody = { RefreshToken: "RefreshToken" };

        expect(result).toEqual("Refreshed");
        expect(dispatch).toHaveBeenCalledWith(authActions.authTokens(mockSuccessResponse));
        expect(requestData).toEqual(JSON.stringify(expectedBody));
      });

      it("does not refresh token", async () => {
        axiosMock.onPost(refreshTokenUrl).reply(400);

        await expect(refreshTokenOperation(dispatch, state))
          .rejects
          .toThrowError("errors.tokenRefresh");

        expect(dispatch).toHaveBeenCalledWith(authActions.logoutUser());
      });

      it("waits if token is already refreshing", async () => {
        axiosMock.onPost(refreshTokenUrl).reply(() => new Promise((resolve) => {
          setTimeout(() => resolve([200, mockSuccessResponse]), 100);
        }));

        const result = await Promise.all([
          refreshTokenOperation(dispatch, state),
          refreshTokenOperation(dispatch, state),
        ]);

        expect(result).toEqual(["Refreshed", "Refreshed"]);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(authActions.authTokens(mockSuccessResponse));
      });
    });
  });
});
