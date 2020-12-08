import React from "react";
import { FBBlankTplFormProps, FBInput, FBSection } from "..";
import { FBFileUpload } from "../FBFileUpload";
import { withFBBlankTplForm } from "./FBBlankTplForm.wrap";

const FBBlankTplForm: React.FunctionComponent<FBBlankTplFormProps> = ({
  label,
  name,
  rules,
  validators,
  validationMode,
  ...props
}) => (
  <FBInput type="blanktplform" {...props} {...{ rules, validators, validationMode }}>
    <FBSection {...{ label }} name={`fb-btf-section-${name}`} />
    <FBFileUpload {...props} {...{ name }} gutter={false} withState autosave />
  </FBInput>
);

export default withFBBlankTplForm(FBBlankTplForm);
