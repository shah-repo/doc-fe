import { FormHelperText } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { AsyncStatus } from "../../../state/types";
import FormMessage, { FormMessageProps } from "./FormMessage";

jest.mock("../Text");

describe("FormMessage component unit tests", () => {
  const getWrapper = (props: FormMessageProps) => mount(
    <FormMessage {...props} />,
  );

  it("displays nothing when no message", () => {
    expect(getWrapper({
      asyncState: {
        status: AsyncStatus.Idle,
        message: "",
      },
    }).text()).toBe("");
  });

  it("displays message", () => {
    const wrapper = getWrapper({
      asyncState: {
        status: AsyncStatus.Success,
        message: "TEST",
      },
    });

    expect(wrapper.text()).toEqual("TEST");
    expect(wrapper.find(FormHelperText).prop("error")).toBeFalsy();
  });

  it("displays message and sets error flag", () => {
    const wrapper = getWrapper({
      asyncState: {
        status: AsyncStatus.Error,
        message: "TEST",
      },
    });

    expect(wrapper.text()).toEqual("TEST");
    expect(wrapper.find(FormHelperText).prop("error")).toBeTruthy();
  });
});
