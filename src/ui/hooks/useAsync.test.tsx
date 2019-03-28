import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { AsyncStatus } from "../../state/types";
import useAsync, { Async } from "./useAsync";

describe("useAsync hook tests", () => {
  let async: Async;
  const onSuccess = jest.fn();
  const onError = jest.fn();

  const TestComponent: React.FunctionComponent = () => {
    async = useAsync({ onSuccess, onError });
    return <div>TEST</div>;
  };

  act(() => {
    mount(<TestComponent />);
  });

  it("has initial state", () => {
    expect(async.asyncState).toEqual({
      status: AsyncStatus.Idle,
      message: "",
    });
  });

  it("calls action and has active state", () => {
    const action = jest.fn();
    act(() => {
      async.start(action);
    });

    expect(action).toHaveBeenCalled();
    expect(async.asyncState).toEqual({
      status: AsyncStatus.Active,
      message: "",
    });
  });

  it("calls onSuccess and has success state", () => {
    act(() => {
      async.successHandler.execute({});
    });

    expect(onSuccess).toHaveBeenCalledWith({});
    expect(async.asyncState).toEqual({
      status: AsyncStatus.Success,
      message: "",
    });
  });

  it("calls onError and has error state", () => {
    act(() => {
      async.errorHandler.execute("ERROR");
    });

    expect(onError).toHaveBeenCalledWith("ERROR");
    expect(async.asyncState).toEqual({
      status: AsyncStatus.Error,
      message: "ERROR",
    });
  });
});
