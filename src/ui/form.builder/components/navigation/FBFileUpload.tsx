import React from "react";
import AttachmentField from "../../../components/common/attachment.field/container";
import AttachmentIconField from "../../../components/common/attachment.icon/container";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBFileUpload: React.FunctionComponent<FBInputProps> = ({
  ...props
}) => (
  <FBInput {...props} type="fileupload">
    <AttachmentField component="field" />
    <AttachmentIconField  />
  </FBInput>
);

export default FBFileUpload;
