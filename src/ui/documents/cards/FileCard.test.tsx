import { IconButton } from "@material-ui/core";
import { shallow } from "enzyme";
import React from "react";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";
import DownloadButtonContainer from "./DownloadButton.container";
import FileCard, { FileCardProps } from "./FileCard";

describe("FileCard tests", () => {
  const attachment = getAttachment();
  const defaultProps: FileCardProps = {
    attachment,
    removeAttachment: undefined,
  };

  const getWrapper = (props: Partial<FileCardProps>) => shallow(
    <FileCard {...defaultProps} {...props} />,
  );

  it("calls removeAttachment", () => {
    const removeAttachment = jest.fn();
    const wrapper = getWrapper({ removeAttachment });
    wrapper.find(IconButton).first().prop("onClick")();
    expect(removeAttachment).toHaveBeenCalled();
  });

  it("does not render removeButton when removeAttachment is undefined", () => {
    const wrapper = getWrapper({ removeAttachment: undefined });
    expect(wrapper.find(IconButton)).toHaveLength(0);
  });

  it("sets correct attachmentId on DownloadButtonContainer", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(DownloadButtonContainer).prop("attachmentId")).toEqual(attachment.id);
  });
});
