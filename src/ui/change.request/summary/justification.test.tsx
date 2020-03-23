import { shallow } from "enzyme";
import React from "react";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import { Justification, Props } from "./justification";

describe("Justification tests without attachments", () => {
  const defaultProps: Props = {
    dataProp: {
      id: "",
      description: "Test description",
      attachments: [ ],
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Justification {...defaultProps} {...props}/>,
  );

  it("Sets props correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(SummaryFieldWithHtml).prop("value")).toEqual(defaultProps.dataProp.description);
  });

  it("AttachmentIconField does not exist", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(AttachmentIconField).exists()).toBe(false);
  });
});

describe("Justification tests with attachments", () => {
  const defaultProps: Props = {
    dataProp: {
      id: "",
      description: "Test description",
      attachments: [ getAttachment() ],
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Justification {...defaultProps} {...props}/>,
  );

  it("AttachmentIconField is displayed", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(AttachmentIconField).exists()).toBe(true);
  });
});
