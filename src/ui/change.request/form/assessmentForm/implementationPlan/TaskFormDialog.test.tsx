import { Button } from "@material-ui/core";
import { shallow, ShallowWrapper } from "enzyme";
import { Formik } from "formik";
import React from "react";

import TaskForm from "./TaskForm";
import { TaskFormDialog, TaskFormDialogProps } from "./TaskFormDialog";

describe("TaskFormDialog tests", () => {
  let wrapper: ShallowWrapper;
  const defaultProps = {
    onSubmit: jest.fn(),
    closeDialog: jest.fn(),
    openDialog: jest.fn(),
    isDialogOpen: false,
    task: null,
  };
  const getWrapper = (props: Partial<TaskFormDialogProps>) => shallow(
    <TaskFormDialog {...defaultProps} {...props} />,
  );

  beforeAll(() => {
    wrapper = getWrapper({});
  });

  it("should call openDialog", () => {
    wrapper.find(Button).at(0).simulate("click");

    expect(defaultProps.openDialog).toHaveBeenCalledTimes(1);
  });

  it("should set correct onSubmit method", () => {
    expect(wrapper.find(Formik).prop("onSubmit")).toEqual(defaultProps.onSubmit);
  });

  it("should set correct cancel prop for form", () => {
    expect(wrapper.find(Formik).at(0).dive().find(TaskForm).prop("cancel")).toEqual(defaultProps.closeDialog);
  });
});
