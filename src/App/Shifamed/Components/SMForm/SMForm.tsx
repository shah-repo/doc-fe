import React from "react";
import { SMFormProps, SMTemplate } from "../../..";
import { withSMFormWrap } from "./SMForm.wrap";

const SMForm: React.FunctionComponent<SMFormProps> = ({
  ...props
}) => <SMTemplate {...props} />;

export default withSMFormWrap(SMForm);
