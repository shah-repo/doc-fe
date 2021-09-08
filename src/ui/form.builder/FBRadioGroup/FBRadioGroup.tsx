import { RadioGroup } from "@material-ui/core";
import React from "react";
import { FBInput, FBRadioGroupProps } from "..";
import { withFBRadioGroup } from "./FBRadioGroup.wrap";

const FBRadioGroup: React.FunctionComponent<FBRadioGroupProps> = ({
  controls,
  row = true,
  type = "radiogroup",
  onBlur,
  ...props
}) => (
  <FBInput {...props} {...{ type }}>
    <RadioGroup {...props} {...{ row  }}>
      {controls}
    </RadioGroup>
  </FBInput>
);

export default withFBRadioGroup(FBRadioGroup);
