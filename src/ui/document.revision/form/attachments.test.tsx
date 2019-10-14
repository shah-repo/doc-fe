import { shallow } from "enzyme";
import React from "react";
import Attachments from "./attachments";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import AttachmentField from "../../components/common/attachment.field/container";
import HeaderField from "../../components/common/header.field/field";

describe("Attachments tests", () => {

  const getWrapper = () => shallow(
    <Attachments />,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(HeaderField)).toHaveLength(1);
    expect(wrapper.find(AttachmentField)).toHaveLength(1);
    expect(wrapper.find(AttachmentIconField)).toHaveLength(1);
  });
});
