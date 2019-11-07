import { Box, TextField } from "@material-ui/core";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBTextFieldProps } from "../../types/textfield";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4} width="100%">
    {labelRenderer}
    <TextField
      multiline={Boolean(props.rows && (props.rows as number) > 0)}
      fullWidth={true}
      {...props}
      variant="outlined"
      label=""
      InputProps={{
        readOnly: props.readOnly,
        className: props.className,
      }}
    />
  </Box>
);

export default withOnChange(withLabelRenderer(FBTextField));
