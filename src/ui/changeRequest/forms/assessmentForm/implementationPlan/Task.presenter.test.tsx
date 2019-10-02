import { Button } from "@material-ui/core";
import { shallow, ShallowWrapper } from "enzyme";
import faker from "faker";
import React from "react";
import { ImplementationPlanTaskFormValues } from "../../types";
import TaskPresenter, { Props } from "./Task.presenter";

describe("TaskPresenter tests", () => {
  let wrapper: ShallowWrapper;

  const task: ImplementationPlanTaskFormValues = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    dueDate: faker.date.recent(),
    assigned: { label: faker.lorem.word(), value: faker.lorem.word() },
    status: "PENDING",
  };
  const defaultProps = {
    task,
    removeTask: jest.fn(),
    editTask: jest.fn(),
    index: 2,
  };
  const getWrapper = (props: Partial<Props>) => shallow(
    <TaskPresenter {...defaultProps} {...props} />,
  );

  beforeAll(() => {
    wrapper = getWrapper({});
  });

  it("should call removeTask", () => {
    wrapper.find(Button).at(0).simulate("click");

    expect(defaultProps.removeTask).toHaveBeenCalledTimes(1);
    expect(defaultProps.removeTask).toHaveBeenLastCalledWith(2);
  });
});
