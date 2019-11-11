
import { shallow, ShallowWrapper } from "enzyme";
import toJson from "enzyme-to-json";
import { FormikProps } from "formik";
import React from "react";
import { Props, TasksContainer } from "./Tasks.container";

describe("Tasks container tests", () => {
  let wrapper: ShallowWrapper;
  const formWithTasks = {
    values: {
      implementationPlan: {
        tasks: [{ title: "Title 1" }, { title: "Title 2" }],
      },
    },
  } as FormikProps<any>;
  const form = {
    values: {
      implementationPlan: {
        tasks: [],
      },
    },
  } as FormikProps<any>;
  const defaultProps = {
    remove: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    form,
  } as unknown as Props;
  const getWrapper = (props: Partial<Props>) => shallow(
    <TasksContainer {...defaultProps} {...props} />,
  );

  beforeAll(() => {
    wrapper = getWrapper({});
  });

  it("should match snapshot - with no tasks", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should match snapshot - with 2 tasks", () => {
    const wrapperWithTasks = getWrapper({ form: formWithTasks });
    expect(toJson(wrapperWithTasks)).toMatchSnapshot();
  });
});
