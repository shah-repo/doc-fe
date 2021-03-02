import React from "react";
import { Attachment } from "../../../../state/ducks/attachments/types";
import Presenter from "./presenter";
import { AttachmentIconFactoryProps, AttachmentIconProps } from "./utils/types";

const AttachmentIconPresenterFactory: React.FunctionComponent<
AttachmentIconFactoryProps
> = ({
  name,
  attachment,
  size,
  handleRemove,
  handleDownload,
  handleContextMenu,
  disabled = false,
  handleIconClick,
  isNewVersion,
  canDeleteFile = true,
  ...other
}) => {
  const file = attachment || {} as Attachment;
  const isUploading = file.s3link == null;
  const isLoading = file.isLoading || false;
  const isRedLine = file.lineType === "RED_LINE";
  const defaultProps = {
    name,
    attachment,
    size,
    disabled,
    isUploading,
    isLoading,
    isRedLine,
    handleRemove,
    canDeleteFile,
    isNewVersion,
    ...other,
  };
  let props: AttachmentIconProps = {
    ...defaultProps,
    handleIconClick,
    handleContextMenu,
    isNewVersion,
  };


  if (isUploading) {
    props = {
      ...defaultProps,
    };
  }

  return <Presenter {...props} />;
};

export default AttachmentIconPresenterFactory;
