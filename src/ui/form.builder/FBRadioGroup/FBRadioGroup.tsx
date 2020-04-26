import { RadioGroup } from "@material-ui/core";
import React from "react";
import { FBRadioGroupProps } from ".";
import { FBInput } from "..";
import { withFBRadioGroup } from "./FBRadioGroup.wrap";

const FBRadioGroup: React.FunctionComponent<FBRadioGroupProps> = ({
  controls,
  row = true,
  ...props
}) => (
  <FBInput {...props} type="radiogroup">
    <RadioGroup {...{ row }}>
      {controls}
    </RadioGroup>
  </FBInput>
);

export default withFBRadioGroup(FBRadioGroup);
