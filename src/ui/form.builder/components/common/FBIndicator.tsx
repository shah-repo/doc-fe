import React from "react";
import { withIndicator } from "../../hocs/common/withIndicator";
import { FBInputProps } from "../../types/common";
import FBInput from "./FBInput";

const FBIndicator: React.FunctionComponent<FBInputProps> = ({ ...props }) => (
  <FBInput {...props} />
);

export default withIndicator(FBIndicator);
