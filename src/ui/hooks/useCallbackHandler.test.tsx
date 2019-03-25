import { mount, ReactWrapper } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import CallbackHandler from "../../common/callbackHandler";
import useCallbackHandler from "./useCallbackHandler";

jest.mock("../../common/callbackHandler", () => class {
  public connect = jest.fn();
  public disconnect = jest.fn();
});

describe("useCallbackHandler hook tests", () => {
  it("calls connect/disconnect on every render", () => {
    let callbackHandler: CallbackHandler = new CallbackHandler();
    let wrapper: ReactWrapper;

    const handler = jest.fn();

    interface TestComponentProps {
      renderId: number;
    }

    const TestComponent: React.FunctionComponent<TestComponentProps> = ({ renderId }) => {
      callbackHandler = useCallbackHandler(handler);
      return <div>{renderId}</div>;
    };

    act(() => {
      wrapper = mount(<TestComponent renderId={1} />);
    });

    expect(callbackHandler.connect).toHaveBeenCalledTimes(1);
    expect(callbackHandler.connect).toHaveBeenLastCalledWith(handler);
    expect(callbackHandler.disconnect).toHaveBeenCalledTimes(0);

    act(() => {
      wrapper.setProps({ renderId: 2 });
    });

    expect(callbackHandler.disconnect).toHaveBeenCalledTimes(0);
    expect(callbackHandler.connect).toHaveBeenCalledTimes(2);
    expect(callbackHandler.connect).toHaveBeenLastCalledWith(handler);

    act(() => {
      wrapper.setProps({ renderId: 3 });
    });

    expect(callbackHandler.disconnect).toHaveBeenCalledTimes(0);
    expect(callbackHandler.connect).toHaveBeenCalledTimes(3);
    expect(callbackHandler.connect).toHaveBeenLastCalledWith(handler);

    act(() => {
      wrapper.unmount();
    });

    expect(callbackHandler.disconnect).toHaveBeenCalledTimes(1); // called disconnect on unmount
    expect(callbackHandler.connect).toHaveBeenCalledTimes(3); // did not call connect again
  });
});
