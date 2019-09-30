import { Button } from "@material-ui/core";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

import SelectField from "../../../../components/forms/fields/Select";
import { ImplementationPlanTaskFormValues } from "../../types";
import { TaskForm, TaskFormProps } from "./TaskForm";

describe("TaskForm tests", () => {
  let wrapper: ShallowWrapper;
  const defaultProps = {
    cancel: jest.fn(),
    values: {} as ImplementationPlanTaskFormValues,
    availableAssigness: [],
    submitCount: 0,
  } as unknown as TaskFormProps;
  const getWrapper = (props: Partial<TaskFormProps>) => shallow(
    <TaskForm {...defaultProps} {...props} />,
  );

  beforeAll(() => {
    wrapper = getWrapper({});
  });

  it("should have correct options when new", () => {
    const expectedOptions = [{ text: "Pending", value: "PENDING" }];
    expect(wrapper.find(SelectField).at(0).prop("options")).toEqual(expectedOptions);
  });

  it("should have correct options when not new", () => {
    const notNewWrapper = getWrapper({ values: { id: "12" } as ImplementationPlanTaskFormValues });
    const expectedOptions = [{ text: "Pending", value: "PENDING" }, { text: "Done", value: "DONE" }];

    expect(notNewWrapper.find(SelectField).at(0).prop("options")).toEqual(expectedOptions);
  });

  it("should cancel and close the dialog", () => {
    wrapper.find(Button).at(1).simulate("click");

    expect(defaultProps.cancel).toHaveBeenCalledTimes(1);
  });
});
