import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { withOnChange } from "../../hocs/withOnChange";
import formBuilderStore from "../../stores/FBStore";
import { FBCheckboxProps } from "../../types/checkbox";
import FBTextField from "./FBTextField";

const FBCheckbox: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  field,
  gutter = true,
  includeNote,
  disabled,
  readOnly,
  ...props
}) => (
  <Box mb={gutter ? 4 : 0}>
    <FormControlLabel
      {...props}
      label={label && <Text message={label} />}
      control={<Checkbox checked={field.value} />}
      disabled={disabled || readOnly}
    />
    {formBuilderStore.mode === "form" && (field.value as boolean) && includeNote && (
      <FBTextField
        disabled={disabled}
        name={`${props.name}_optionNote_field`}
      />)
    }
  </Box>
);

export default withOnChange(FBCheckbox);
