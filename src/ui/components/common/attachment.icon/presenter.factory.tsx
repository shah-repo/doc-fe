import React from "react";
import { Attachment } from "../../../../state/ducks/attachments";
import { checkIfFileIsViewable } from "../view.file/utils/helpers";
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
  ...other
}) => {
  const file = attachment || {} as Attachment;
  const isUploading = file.s3link == null;
  const isLoading = file.isLoading || false;
  const isFileViewable = checkIfFileIsViewable(file.type);
  const defaultProps = {
    name,
    attachment,
    size,
    disabled,
    isUploading,
    isLoading,
    handleRemove,
    ...other,
  };
  let props: AttachmentIconProps = {
    ...defaultProps,
    handleIconClick: handleDownload,
    handleContextMenu,
  };

  if (isFileViewable && !isUploading) {
    props = {
      ...defaultProps,
      handleIconClick: handleViewFile,
      handleContextMenu,
    };
  }

  if (isUploading) {
    props = {
      ...defaultProps,
    };
  }

  return <Presenter {...props} />;
};

export default AttachmentIconPresenterFactory;
