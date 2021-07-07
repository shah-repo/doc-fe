import { RadioGroup } from "@material-ui/core";
import React from "react";
import { FBInput, FBRadioGroupProps } from "..";
import { withFBRadioGroup } from "./FBRadioGroup.wrap";

const FBRadioGroupComp: React.FunctionComponent<FBRadioGroupProps> = ({
  row, controls, onChange, defaultValue, name,
}) =>
  <RadioGroup {...{ row, onChange, defaultValue, name }}>
    {controls}
  </RadioGroup>;


const FBRadioGroupChild = withFBRadioGroup(FBRadioGroupComp);

const FBRadioGroup: React.FunctionComponent<FBRadioGroupProps> = ({
  controls,
  row = true,
  ...props
}) => (
  <FBInput {...props} type="radiogroup">
    <FBRadioGroupChild {...props} {...{ row, controls }} />
  </FBInput>
);

export default FBRadioGroup;
