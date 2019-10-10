import { shallow } from "enzyme";
import React from "react";
import TaskPresenter from "./Task.presenter";
import TaskFormDialog from "./TaskFormDialog";
import TasksPresenter, { Props } from "./Tasks.presenter";

describe("Tasks presenter test without tasks", () => {

  const defaultProps: Props = {
    tasks: [],
    openDialog: jest.fn(),
    closeDialog: jest.fn(),
    onSubmit: jest.fn(),
    selectedTask: null,
    isDialogOpen: false,
    numberOfTasks: 0,
    removeTask: jest.fn(),
    editTask: jest.fn(),
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <TasksPresenter {...defaultProps} {...props}/>,
  );

  it("Doesnt show task presenter if there is no tasks", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(TaskPresenter)).toHaveLength(0);
    expect(wrapper.find(TaskFormDialog)).toHaveLength(1);
  });
});

describe("Tasks presenter test with tasks", () => {

  const defaultProps: Props = {
    tasks: [{
      title:  "Task 1",
      description:  "Test",
      status: "DONE",
    },
    {
      title:  "Task 2",
      description:  "Test",
      status: "PENDING",
    },
  ],
    openDialog: jest.fn(),
    closeDialog: jest.fn(),
    onSubmit: jest.fn(),
    selectedTask: null,
    isDialogOpen: false,
    numberOfTasks: 2,
    removeTask: jest.fn(),
    editTask: jest.fn(),
  };

  const getWrapper = (props: Partial<Props>) => shallow(
    <TasksPresenter {...defaultProps} {...props}/>,
  );

  it("Match number of task presenters to number of tasks", () => {

    const wrapper = getWrapper({...defaultProps});

    expect(wrapper.find(TaskPresenter)).toHaveLength(2);
    expect(wrapper.find(TaskFormDialog)).toHaveLength(1);
  });
});
