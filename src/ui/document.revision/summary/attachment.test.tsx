import { shallow } from "enzyme";
import React from "react";
import AttachmentField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import { Attachment } from "./attachment";

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
