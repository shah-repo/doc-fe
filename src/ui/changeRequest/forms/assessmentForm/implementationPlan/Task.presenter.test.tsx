import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import faker from "faker";

import { Button } from "@material-ui/core";
import TaskPresenter, { Props } from "./Task.presenter";

describe("TaskPresenter tests", () => {
  let wrapper: ShallowWrapper;
  const task = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    assigned: [],
  };
  const defaultProps = {
    task,
    removeTask: jest.fn(),
    index: 2,
  };
  const getWrapper = (props: Partial<Props>) => shallow(
    <TaskPresenter {...defaultProps} {...props} />,
  );

  beforeAll(() => {
    wrapper = getWrapper({});
  })

  it("should call removeTask", () => {
    wrapper.find(Button).at(0).simulate('click');

    expect(defaultProps.removeTask).toHaveBeenCalledTimes(1);
    expect(defaultProps.removeTask).toHaveBeenLastCalledWith(2);
  });
});
