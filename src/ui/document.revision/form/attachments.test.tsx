import { shallow } from "enzyme";
import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import Attachments from "./attachments";

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
