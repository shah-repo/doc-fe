import { FormGroup } from "@material-ui/core";
import React from "react";
import { FBCheckboxGroupProps, FBInput } from "..";
import { withFBCheckboxGroup } from "./FBCheckboxGroup.wrap";

const FBCheckboxGroup: React.FunctionComponent<FBCheckboxGroupProps> = ({
  controls,
  row = true,
  ...props
}) => (
  <FBInput {...props} type="checkboxgroup">
    <FormGroup {...{ row }}>
      {controls}
    </FormGroup>
  </FBInput>
);

export default withFBCheckboxGroup(FBCheckboxGroup);
