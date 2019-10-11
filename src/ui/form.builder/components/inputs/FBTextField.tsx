import { Box, TextField } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

type Props =
  & Omit<OutlinedTextFieldProps, "variant">
  & FBFormDefaultProps
  & FBOnChangeProps;

const FBTextField: React.FunctionComponent<Props> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <TextField
      multiline={Boolean(props.rows && ((props.rows as number) > 0))}
      fullWidth={true}
      {...props}
      variant="outlined"
      label=""
    />
  </Box>
);

export default withOnChange(withLabelRenderer(FBTextField));
