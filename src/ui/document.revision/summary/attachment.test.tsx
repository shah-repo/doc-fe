import { shallow } from "enzyme";
import React from "react";
import AttachmentField from "../../components/common/attachment.icon/container";
import { Attachment, Props } from "./attachment";

describe("Attachment tests", () => {
  const defaultProps: Props = {
    isAttachmentEmpty: false,
  };
  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Attachment {...defaultProps} {...props} />,
  );

  it("Attachment Field is disabled", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(AttachmentField).prop("disabled")).toEqual(true);
  });
});
