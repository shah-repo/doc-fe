import React from "react";
import { AttachmentIconProps } from "./utils/types";
import AttachmentIconPresenter from "./presenter";

export const AttachmentIconPresenterFactory: React.FunctionComponent<AttachmentIconProps> = ({
  ...props
}) => {
  return <AttachmentIconPresenter {...props} />;
};

export default AttachmentIconPresenterFactory;
