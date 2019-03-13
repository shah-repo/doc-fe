import { apiAction } from ".";
import { CALL_API } from "../middlewares/api";

describe("apiAction factory tests", () => {
  it("returns default values", () => {
    const action = apiAction({});
    expect(action).toMatchObject({
      type: CALL_API,
      url: "/",
      includeAuthorization: true,
    });

    expect(action.onSuccess).toBeDefined();
    expect(action.onFailure).toBeDefined();
    expect(action.onCompleted).toBeDefined();
  });

  it("overrides default values", () => {
    const action = apiAction({ url: "test" });
    expect(action.url).toEqual("test");
  });

  it("does not allow type to be overriden", () => {
    const action = apiAction({ type: "test" });
    expect(action.type).toEqual(CALL_API);
  });
});
