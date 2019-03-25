import CallbackHandler from "./callbackHandler";

describe("callbackHandler tests", () => {
  const callbackHandler = new CallbackHandler();

  it("sets and calls handler", () => {
    const handler = jest.fn();
    callbackHandler.connect(handler);
    callbackHandler.execute({});

    expect(handler).toHaveBeenCalled();
  });

  it("diconnects and does not call handler", () => {
    const handler = jest.fn();
    callbackHandler.connect(handler);
    callbackHandler.disconnect();
    callbackHandler.execute({});

    expect(handler).not.toHaveBeenCalled();
  });
});
