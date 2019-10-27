import { Box, TextField } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

export type Props = Omit<OutlinedTextFieldProps, "variant"> &
  FBFormDefaultProps &
  FBOnChangeProps;

const FBTextField: React.FunctionComponent<
  Omit<Props, "onChange"> & {
    onChange?: () => (e: React.ChangeEvent<HTMLInputElement> | Date) => any;
  }
> = ({ labelRenderer, ...props }) => (
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
