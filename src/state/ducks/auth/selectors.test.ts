import _ from "lodash";
import { ApplicationState } from "../../reducers";
import initialStoreState from "../../tests/helpers/initialStoreState";
import authSelectors from "./selectors";

describe("auth selectors tests", () => {
  let state: ApplicationState;

  beforeEach(() => {
    state = _.cloneDeep(initialStoreState);
  });

  describe("isAutenticated selector tests", () => {
    it("user is not authenticated", () => {
      expect(authSelectors.isAuthenticated(state)).toBe(false);
    });

    it("user is authenticated", () => {
      state.auth.tokens.id.value = "ID_TOKEN";
      expect(authSelectors.isAuthenticated(state)).toBe(true);
    });
  });

  describe("currentUserEmail selector tests", () => {
    it("it returns email address", () => {
      state.auth.user.email = "dino@codecons.com";
      expect(authSelectors.currentUserEmail(state)).toEqual("dino@codecons.com");
    });
  });

  describe("accessToken selector tests", () => {
    it("it returns access token value", () => {
      state.auth.tokens.access.value = "TOKEN";
      expect(authSelectors.accessToken(state)).toEqual("TOKEN");
    });
  });
});
