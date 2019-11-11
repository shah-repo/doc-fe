import { Box, TextField } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import Text from "../../../components/Text";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

type Props =
  & Omit<OutlinedTextFieldProps, "variant">
  & FBFormDefaultProps
  & FBOnChangeProps;

const FBOptionsContainer: React.FunctionComponent<Props> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <Text message="form.builder.options.placeholder">
      {(placeholder) => (
        <TextField
          {...props}
          name="options"
          multiline={true}
          fullWidth={true}
          rows={5}
          placeholder={placeholder as string}
          variant="outlined"
          label=""
        />
      )}
    </Text>
    <Box display="flex" pt={0.5}>
      <Text message="form.builder.options.note" />
    </Box>
  </Box>
);

export default withOnChange(withLabelRenderer(FBOptionsContainer));
