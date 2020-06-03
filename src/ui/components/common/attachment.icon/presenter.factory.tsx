import React from "react";
import { Attachment } from "../../../../state/ducks/attachments";
import Presenter from "./presenter";
import { AttachmentIconFactoryProps, AttachmentIconProps } from "./utils/types";

export const AttachmentIconPresenterFactory: React.FunctionComponent<
AttachmentIconFactoryProps
> = ({
  name,
  attachment,
  size,
  handleRemove,
  handleDownload,
  handleContextMenu,
  handleViewFile,
  disabled = false,
  handleIconClick,
  ...other
}) => {
  const file = attachment || {} as Attachment;
  const isUploading = file.s3link == null;
  const isLoading = file.isLoading || false;
  const isRedLine = file.groupType === "RED_LINE";
  const defaultProps = {
    name,
    attachment,
    size,
    disabled,
    isUploading,
    isLoading,
    isRedLine,
    handleRemove,
    ...other,
  };
  let props: AttachmentIconProps = {
    ...defaultProps,
    handleIconClick,
    handleContextMenu,
  };


  if (isUploading) {
    props = {
      ...defaultProps,
    };
  }

  return <Presenter {...props} />;
};

export default AttachmentIconPresenterFactory;
