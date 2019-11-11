import {
  FormHelperText, InputLabel,
} from "@material-ui/core";
import { mount, ReactWrapper } from "enzyme";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { FieldOwnProps } from "./Field";
import InputField from "./Input";

jest.mock("../../Text");

describe("Field component tests", () => {
  interface TestFormValues {
    test: string;
  }

  let formProps: FormikProps<TestFormValues>;

  const getWrapper = (props: FieldOwnProps): ReactWrapper => {
    const renderForm = (formInstanceProps: FormikProps<TestFormValues>) => {
      formProps = formInstanceProps;

      return (
        <Form>
          <InputField name="test" {...props} />
        </Form>
      );
    };

    return mount(
      <Formik
        initialValues={{ test: "" }}
        onSubmit={jest.fn()}
        render={renderForm}
      />,
    );
  };

  it("displays input component by default", () => {
    const wrapper = getWrapper({});

    expect(wrapper.find(InputField)).toHaveLength(1);
    expect(wrapper.find(InputLabel)).toHaveLength(0);
    expect(wrapper.find(FormHelperText)).toHaveLength(0);
  });

  it("displays label", () => {
    const wrapper = getWrapper({
      label: "login.title",
    });

    expect(wrapper.text()).toContain("login.title");
  });

  it("displays error component", () => {
    const wrapper = getWrapper({});
    const formActions = formProps as FormikProps<TestFormValues>;
    formActions.setFieldError("test", "Does not work");
    formActions.setFieldTouched("test", true);
    wrapper.update();

    expect(wrapper.text()).toContain("Does not work");
  });

  it("does not display error component when field is not touched", () => {
    const wrapper = getWrapper({});
    const formActions = formProps as FormikProps<TestFormValues>;
    formActions.setFieldError("test", "Does not work");
    formActions.setFieldTouched("test", false);
    wrapper.update();

    expect(wrapper.text()).not.toContain("Does not work");
  });
});
