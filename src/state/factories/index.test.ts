import { apiAction, apiActionWithCallbacks } from ".";
import { getCallbackHandler } from "../../common/tests/factories";
import { CALL_API } from "../middlewares/api";
import { Handlers } from "../types";

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

describe("apiActionWithCallbacks factory tests", () => {
  const handlers: Handlers<string> = {
    successHandler: getCallbackHandler<string>(),
    errorHandler: getCallbackHandler<string>(),
    setCancelToken: () => null,
  };

  const dispatch = jest.fn();
  const onSuccess = jest.fn();
  const onFailure = jest.fn();

  const action = apiActionWithCallbacks<string, any>({
    handlers,
    onSuccess,
    onFailure,
  });

  it("calls success handler", () => {
    action.onSuccess("test", dispatch);

    expect(onSuccess).toHaveBeenCalledWith("test", dispatch);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(handlers.successHandler.execute).toHaveBeenCalledWith("test");
  });

  it("calls error handler", () => {
    action.onFailure("test", dispatch);

    expect(onFailure).toHaveBeenCalledWith("test", dispatch);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(handlers.errorHandler.execute).toHaveBeenCalledWith("test");
  });
});
