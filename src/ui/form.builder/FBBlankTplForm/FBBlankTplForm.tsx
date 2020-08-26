import React from "react";
import { FBBlankTplFormProps, FBInput, FBSection } from "..";
import { FBFileUpload } from "../FBFileUpload";
import { withFBBlankTplForm } from "./FBBlankTplForm.wrap";

const FBBlankTplForm: React.FunctionComponent<FBBlankTplFormProps> = ({
  label,
  ...props
}) => (
  <FBInput type="blanktplform">
    <FBSection {...{ label }}  />
    <FBFileUpload {...props} gutter={false} withState autosave />
  </FBInput>
);

export default withFBBlankTplForm(FBBlankTplForm);
