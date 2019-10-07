import { shallow } from "enzyme";
import React from "react";
import Justification from "./justification";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import TextEditorField from "../../components/forms/fields/TextEditor";

describe("Justification tests", () => {
  const getWrapper = () => shallow(
    <Justification />,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(TextEditorField).exists()).toEqual(true);
    expect(wrapper.find(AttachmentIconField).exists()).toEqual(true);
  });
});
