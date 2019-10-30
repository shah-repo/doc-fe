import { shallow } from "enzyme";
import React from "react";
import { Attachment } from "./attachment";
import AttachmentField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";

describe("Attachment tests", () => {

  const getWrapper = () => shallow(
    <Attachment />,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(HeaderField)).toHaveLength(1);
  });

  it("Attachment Field is disabled", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(AttachmentField).prop("disabled")).toEqual(true);
  });
});
