import { Checkbox, FormControlLabel, SvgIconProps } from "@material-ui/core";
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
  fontSize = "default",
  ...props
}) => (
    <FBInput {...props} {...{ disabled, label, defaultChecked }} type="checkbox">
      <FormControlLabel
        control={(
          <Checkbox
            data-cy={`fb-control-${label}`}
            icon={<CheckBoxOutlineBlankIcon fontSize={fontSize as SvgIconProps["fontSize"]} />}
            checkedIcon={<CheckBoxIcon fontSize={fontSize as SvgIconProps["fontSize"]} />}
            {...{ disabled, defaultChecked }} />
        )}
        label=""
        {...label && { label: <Text message={label as string} /> }}
      />
    </FBInput>
  );

export default withFBCheckbox(FBCheckbox);
