import { mount, ReactWrapper } from "enzyme";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { Props } from "./FBTextEditorField";
import FBTextEditorField from "./FBTextEditorField";

jest.mock("../../../components/Text");

declare global {
  namespace NodeJS {
    interface Global {
      MutationObserver: any;
      document: any;
    }
  }
}

global.MutationObserver = class {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
};
global.document.getSelection = function() {};

describe("FBTexEditortField component tests", () => {
  interface TestFormValues {
    label: string;
  }
  let formProps: FormikProps<TestFormValues>;

  const getWrapper = (props: Partial<Props>): ReactWrapper => {
    const renderForm = (formInstanceProps: FormikProps<TestFormValues>) => {
      formProps = formInstanceProps;

      return (
        <Form>
          <FBTextEditorField {...props} />
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
  it("displays FBTexEditortField component by default", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(FBTextEditorField)).toHaveLength(1);
  });

  it("displays label", () => {
    const wrapper = getWrapper({ label: "textfield label" });

    expect(wrapper.text()).toContain("textfield label");
  });
});
