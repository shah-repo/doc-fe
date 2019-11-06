import { shallow } from "enzyme";
import { ErrorMessage, FieldArray } from "formik";
import React from "react";
import AttachmentIconField from "../../../../components/common/attachment.icon/container";
import HeaderField from "../../../../components/common/header.field/field";
import Container, { Props } from "./Container";

describe("Container tests", () => {
  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <Container {...props} />,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    expect(wrapper.find(HeaderField)).toHaveLength(1);
    expect(wrapper.find(FieldArray)).toHaveLength(1);
    expect(wrapper.find(AttachmentIconField)).toHaveLength(1);
  });
});
