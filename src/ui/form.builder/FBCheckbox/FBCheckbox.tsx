import { Checkbox, FormControlLabel } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
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
  <FBInput {...props} {...{ disabled, label, defaultChecked }} type="checkbox">
    <FormControlLabel
      control={(
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          {...{ disabled, defaultChecked }} />
      )}
      label=""
      {...label && { label: <Text message={label as string} /> }}
    />
  </FBInput>
);

export default withFBCheckbox(FBCheckbox);
