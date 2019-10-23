import { Dialog } from "@material-ui/core";
import { shallow } from "enzyme";
import faker from "faker";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../components/forms/fields/Input";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import { CloseTask, Props } from "./close.task";

describe("CloseTask tests", () => {
  const defaultProps: Props = {
    crId: faker.random.uuid(),
    taskId: faker.random.uuid(),
    closeTask: jest.fn(),
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <CloseTask {...defaultProps} {...props}/>,
  );

  it("Sets async state correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(FormProgress).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
    expect(wrapper.find(FormMessage).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("Dialog is initially closed", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Dialog).prop("open")).toEqual(false);
  });

  it("Formik is set correctly", () => {
    const wrapper = getWrapper();
    const formik = wrapper.find(Formik).dive();
    expect(formik.find(Form)).toHaveLength(1);
    expect(formik.find(InputField).exists()).toBe(true);
  });
});
