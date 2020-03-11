import React from "react";
import { Attachment } from "../../../../state/ducks/attachments";
import { VIEWABLE_FILES } from "../view.file/utils/constants";
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
  const isFileViewable = VIEWABLE_FILES.includes(file.type);
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
