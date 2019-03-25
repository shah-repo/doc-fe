import { Button } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { AsyncStatus } from "../../../state/types";
import SubmitButton, { SubmitButtonProps } from "./SubmitButton";

jest.mock("../Text");

describe("SubmitButton component unit tests", () => {
  const getWrapper = (props: SubmitButtonProps) => mount(
    <SubmitButton {...props} />,
  );

  it("displays label", () => {
    const wrapper = getWrapper({
      asyncState: {
        status: AsyncStatus.Idle,
        message: "",
      },
      label: "login.title",
    });

    expect(wrapper.text()).toContain("login.title");
    expect(wrapper.find(Button).prop("disabled")).toBeFalsy();
  });

  it("sets disabled flag", () => {
    const wrapper = getWrapper({
      asyncState: {
        status: AsyncStatus.Active,
        message: "",
      },
      label: "login.title",
    });

    expect(wrapper.find(Button).prop("disabled")).toBeTruthy();
  });
});
