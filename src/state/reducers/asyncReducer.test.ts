import { AsyncActionPayload, AsyncStatus } from "../types";
import asyncReducer, { ASYNC_REDUCER_INITIAL_STATE } from "./asyncReducer";

describe("asyncReducer tests", () => {
  const type = "type/ASYNC";
  const reducer = asyncReducer(type);

  it("has default state", () => {
    expect(reducer(undefined, {
      type: "WRONG TYPE",
      payload: { status: AsyncStatus.Active, message: "Test message" },
    })).toEqual(ASYNC_REDUCER_INITIAL_STATE);
  });

  it("sets state", () => {
    const payload: AsyncActionPayload = {
      status: AsyncStatus.Active,
      message: "Test message",
    };

    expect(reducer(ASYNC_REDUCER_INITIAL_STATE, { type, payload })).toEqual(payload);
  });
});
