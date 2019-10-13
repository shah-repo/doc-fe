import { Box, Radio, FormControlLabel } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { withOnChange } from "../../hocs/withOnChange";
import { formBuilderStore } from "../../stores/FBStore";
import { FBCheckboxProps } from "../../types/checkbox";
import FBTextField from "./FBTextField";

const FBRadio: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  field,
  gutter = true,
  includeNote,
  ...props
}) => (
  <Box mb={gutter ? 4 : 0}>
    <FormControlLabel
      {...props}
      label={label && <Text message={label} />}
      control={<Radio checked={field.value === label} value={label} />}
    />
    {formBuilderStore.mode === "form" &&
      field.value === label &&
      includeNote && (
        <FBTextField
          disabled={props.disabled}
          name={`${props.name}_optionNote_field`}
        />
      )}
  </Box>
);

export default withOnChange(FBRadio);
