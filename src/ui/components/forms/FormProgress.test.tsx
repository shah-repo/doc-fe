import { LinearProgress } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { AsyncStatus } from "../../../state/types";
import FormProgress, { FormProgressProps } from "./FormProgress";

describe("FormProgress component unit tests", () => {
  const getWrapper = (props: FormProgressProps) => mount(
    <FormProgress {...props} />,
  );

  it("displays nothing when not active", () => {
    expect(getWrapper({
      asyncState: {
        status: AsyncStatus.Idle,
        message: "",
      },
    }).text()).toBe("");
  });

  it("displays LinearProgress when active", () => {
    const wrapper = getWrapper({
      asyncState: {
        status: AsyncStatus.Active,
        message: "",
      },
    });

    expect(wrapper.find(LinearProgress)).toHaveLength(1);
  });
});
