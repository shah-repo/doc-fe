import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBInputProps> = ({
  label = "",
  labelValues,
  defaultValue,
  isFullWidth,
  ...props
}) => {
  console.log(defaultValue, props.value);

  return (
    <FBInput {...props} type="checkbox" fullWidth={isFullWidth} >
      <FormControlLabel
        style={{ margin: isFullWidth ? "0 16px 0 -11px" : 0 }}
        label={<Text message={label as string} values={labelValues} />}
        control={(
          <Checkbox
            style={{ padding: isFullWidth ? 9 : 0 }}
            disabled={props.disabled}
            value={props.name}
            checked={defaultValue as boolean || props.value as boolean}
          />
        )}
      />
    </FBInput>);
};

export default FBCheckbox;
