import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import { styles } from "../../../../../src/ui/form.builder/styles/FBEditorTextFieldWithRange.styles";
import Text from "../../../components/Text";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBInputProps> = ({
  label = "",
  defaultValue,
  ...props
}) => {
  const classes = styles();
  return (
    <FBInput {...props} type="checkbox" >
      <FormControlLabel
        label={<Text message={label as string} />}
        className={classes.checkbox}
        control={(
          <Checkbox
            className={classes.checkbox}
            disabled={props.disabled}
            value={props.name}
            checked={defaultValue as boolean || props.value as boolean}
          />
        )}
      />
    </FBInput>);
};

export default FBCheckbox;
