import React from "react";
import { FBInputProps } from "../../types/common";
import FBInput from "./FBInput";
import { withIndicator } from "../../hocs/common/withIndicator";

const FBIndicator: React.FunctionComponent<FBInputProps> = ({
  ...props
}) => (
  <FBInput {...props} />
);

export default withIndicator(FBIndicator);
