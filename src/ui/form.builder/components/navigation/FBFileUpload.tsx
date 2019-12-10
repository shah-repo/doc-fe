import React from "react";
import AttachmentField from "../../../components/common/attachment.field/container";
import AttachmentIconField from "../../../components/common/attachment.icon/container";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBFileUpload: React.FunctionComponent<FBInputProps> = ({
  disabled,
  name,
  ...props
}) => (
  <FBInput {...props} {...{name}} type="fileupload">
    <AttachmentField {...{name, disabled}} name={name} component="field" />
    <AttachmentIconField {...{name, disabled}}  />
  </FBInput>
);

export default FBFileUpload;
