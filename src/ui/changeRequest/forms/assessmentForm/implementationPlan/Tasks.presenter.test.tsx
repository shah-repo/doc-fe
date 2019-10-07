import { shallow } from "enzyme";
import React from "react";
import TaskPresenter from "./Task.presenter";
import TaskFormDialog from "./TaskFormDialog";
import TasksPresenter, { Props } from "./Tasks.presenter";

describe("Tasks presenter test", () => {

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

  const getWrapper = (props: Partial<Props>) => shallow(
    <TasksPresenter {...defaultProps} {...props}/>,
  );

  it("Dont show task presenter if there is no tasks", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(TaskPresenter)).toHaveLength(0);
    expect(wrapper.find(TaskFormDialog)).toHaveLength(1);
  });

  it("Match number of task presenters to number of tasks", () => {
    const defaultProps: Props = {
      tasks: [{
        title:  "Task 1",
        description:  "Test",
      },
      {
        title:  "Task 2",
        description:  "Test",
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
    const wrapper = getWrapper({...defaultProps});

    expect(wrapper.find(TaskPresenter)).toHaveLength(2);
    expect(wrapper.find(TaskFormDialog)).toHaveLength(1);
  });
});
