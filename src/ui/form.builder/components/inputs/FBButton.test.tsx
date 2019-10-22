import { mount, ReactWrapper } from "enzyme";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { Props } from "./FBButton";
import FBButton from "./FBButton";

jest.mock("../../../components/Text");

describe("FBButton component tests", () => {
  const getWrapper = (props: Props) => mount(<FBButton {...props} />);

  it("displays button component by default", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(FBButton)).toHaveLength(1);
  });

  it("displays label", () => {
    const wrapper = getWrapper({
      label: "button_label",
    });

    expect(wrapper.text()).toContain("button_label");
  });
});
