import React from "react";
import { VIEWABLE_FILES } from "../view.file/utils/constants";
import Presenter from "./presenter";
import { styles } from "./utils/styles";
import { AttachmentIconFactoryProps, AttachmentIconProps } from "./utils/types";

export const AttachmentIconPresenterFactory: React.FunctionComponent<
AttachmentIconFactoryProps
> = ({
  attachment,
  size,
  handleRemove,
  handleDownload,
  handleContextMenu,
  handleViewFile,
  disabled = false,
  ...other
}) => {
  const file = attachment!;
  const isUploading = file.s3link == null;
  const isLoading = file.isLoading || false;
  const isFileViewable = VIEWABLE_FILES.includes(file.type);
  const defaultProps = {
    name,
    attachment,
    isUploading,
    isLoading,
  };
  let props: AttachmentIconProps = {
    ...defaultProps,
    handleContextMenu,
    handleRemove,
    handleIconClick: handleDownload,
  };

  if (isUploading) {
    props = {
      ...defaultProps,
      handleContextMenu,
    };
  }

  if (isFileViewable) {
    props = {
      ...defaultProps,
      handleContextMenu,
      handleRemove,
      handleIconClick: handleViewFile,
    };
  }

  return (
    <Presenter
      {...other}
      {...props}
    />
  );
};

export default AttachmentIconPresenterFactory;
