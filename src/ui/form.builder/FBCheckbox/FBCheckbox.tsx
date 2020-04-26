import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputProps } from "..";
import Text from "../../components/Text";
import { withFBCheckbox } from "./FBCheckbox.wrap";

const FBCheckbox: React.FunctionComponent<FBInputProps> = ({
  label,
  disabled,
  defaultChecked,
  ...props
}) =>  (
  <FBInput {...props} {...{ disabled, label }} type="checkbox">
    <FormControlLabel
      control={<Checkbox {...{ disabled, defaultChecked }} />}
      label={<Text message={label as string} />}
    />
  </FBInput>
);

export default withFBCheckbox(FBCheckbox);
