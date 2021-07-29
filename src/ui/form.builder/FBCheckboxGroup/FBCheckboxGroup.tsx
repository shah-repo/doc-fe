import { FormGroup } from "@material-ui/core";
import React from "react";
import { FBCheckboxGroupProps, FBInput } from "..";
import { withFBCheckboxGroup } from "./FBCheckboxGroup.wrap";

const FBCheckboxGroupComp: React.FunctionComponent<FBCheckboxGroupProps> = ({
  row, controls, name,
}) => <FormGroup {...{ row, name }}>
  {controls}
</FormGroup>;


const FBCheckboxGroupChild = withFBCheckboxGroup(FBCheckboxGroupComp);

const FBCheckboxGroup: React.FunctionComponent<FBCheckboxGroupProps> = ({
  controls,
  row = true,
  ...props
}) => (
  <FBInput {...props}  type="checkboxgroup">
    <FBCheckboxGroupChild {...props} {...{ row, controls }} />
  </FBInput>
);

export default FBCheckboxGroup;
