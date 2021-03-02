import { Card, CardActions, CardContent, Tooltip } from "@material-ui/core";
import { shallow } from "enzyme";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments/types";
import DownloadButtonContainer from "./DownloadButton.container";
import FileCard, { FileCardProps } from "./FileCard";

describe("Filecard component unit tests", () => {
  const attachment: Attachment = {
    id: "testId",
    name: "testName",
    type: "testType",
    s3link: "tests3Link",
    s3linkCleanCopy: "testS3LinkCleanCopy",
    isLoading: false,
  };

  const getWrapper = (props: FileCardProps) => shallow(<FileCard {...props} />);

  it("Displays correctly", () => {
    const wrapper = getWrapper({ attachment });
    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardContent)).toHaveLength(1);
    expect(wrapper.find(CardActions)).toHaveLength(1);
    expect(wrapper.find(DownloadButtonContainer)).toHaveLength(1);
  });

  it("Displays attachment name", () => {
    const wrapper = getWrapper({ attachment });
    expect(wrapper.find({ variant: "h5" }).text()).toEqual("testName");
  });
  it("Displays attachment type", () => {
    const wrapper = getWrapper({ attachment });
    expect(wrapper.find({ color: "textSecondary" }).text()).toEqual("testType");
  });

  it("Displays the complete filename through a tooltip", () => {
    const wrapper = getWrapper({ attachment });
    expect(wrapper.find(Tooltip).prop("title")).toEqual("testName.testType");
  });

  it("Displays remove button if removeAttachment is present", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const wrapper = getWrapper({ attachment, removeAttachment: () => {} });
    expect(wrapper.find({ "aria-label": "Delete" })).toHaveLength(1);
  });

  it("Calls remove attachment function when IconButton is clicked", () => {
    const removeAttachment = jest.fn();
    const wrapper = getWrapper({ attachment, removeAttachment });
    const deleteButton = wrapper.find({ "aria-label": "Delete" });
    deleteButton.simulate("click");
    expect(removeAttachment).toHaveBeenCalled();
  });
});
