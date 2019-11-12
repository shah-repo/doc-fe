import { mount, ReactWrapper } from "enzyme";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { Props } from "./FBTextField";
import FBTextField from "./FBTextField";

jest.mock("../../../components/Text");

describe("FBTextField component tests", () => {
  interface TestFormValues {
    label: string;
  }
  // tslint:disable-next-line: no-unused-declaration
  let formProps: FormikProps<TestFormValues>;

  const getWrapper = (props: Partial<Props>): ReactWrapper => {
    const renderForm = (formInstanceProps: FormikProps<TestFormValues>) => {
      formProps = formInstanceProps;

      return (
        <Form>
          <FBTextField {...props} />
        </Form>
      );
    };

    return mount(
      <Formik
        initialValues={{
          label: "",
        }}
        onSubmit={jest.fn()}
        render={renderForm}
      />,
    );
  };
  it("displays FBTextField component by default", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(FBTextField)).toHaveLength(1);
  });

  it("displays label", () => {
    const wrapper = getWrapper({ label: "textfield label" });

    expect(wrapper.text()).toContain("textfield label");
  });
});
