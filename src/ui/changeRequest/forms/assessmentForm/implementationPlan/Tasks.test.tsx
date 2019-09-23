import { Button } from "@material-ui/core";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

import { ImplementationPlanTaskFormValues } from "../../types";
import { TaskForm, TaskFormProps } from "./TaskForm";

describe("Tasks tests", () => {
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

  it("should", () => {

  });
});
