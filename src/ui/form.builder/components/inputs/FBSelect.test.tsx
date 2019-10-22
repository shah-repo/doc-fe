import { mount, ReactWrapper, shallow } from "enzyme";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { FBSelectProps } from "../../types/select";
import FBSelect from "./FBSelect";
import FBNoteTextField from "../custom/FBNoteTextField";
import FBTextField from "./FBTextField";

jest.mock("../../../components/Text");

describe("FBSelect component tests", () => {
  interface TestFormValues {
    label: string;
  }
  let formProps: FormikProps<TestFormValues>;

  const getWrapper = (props: Partial<FBSelectProps>): ReactWrapper => {
    const renderForm = (formInstanceProps: FormikProps<TestFormValues>) => {
      formProps = formInstanceProps;

      return (
        <Form>
          <FBSelect {...props} />
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
  it("displays FBSelect component by default", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(FBSelect)).toHaveLength(1);
  });

  it("displays label", () => {
    const wrapper = getWrapper({ label: "FBSelect label" });

    expect(wrapper.text()).toContain("FBSelect label");
  });

  it("displays FBNoteTextField if shownote is true", () => {
    const wrapper = getWrapper({ showNote: true });

    expect(wrapper.find("input")).toHaveLength(1);
  });

  it("adds correct prop name to input field", () => {
    const wrapper = getWrapper({ name: "input name" });

    expect(wrapper.find("input").prop("name")).toBe("input name");
  });
});
