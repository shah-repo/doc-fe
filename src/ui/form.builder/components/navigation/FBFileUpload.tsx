import { Box } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import AttachmentField from "../../../components/common/attachment.field/container";
import AttachmentIconField from "../../../components/common/attachment.icon/container";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

export type Props = Omit<OutlinedTextFieldProps, "variant"> &
  FBFormDefaultProps &
  FBOnChangeProps;

const FBFileUpload: React.FunctionComponent<Props> = ({
  labelRenderer,
  disabled,
  name,
  error,
  helperText,
}) => (
  <Box mb={5} width="100%">
    {labelRenderer}
    <Box border={1} borderColor={error ? "error.main" : "transparent"}>
      <AttachmentField name={name} component="field" disabled={disabled} />
    <Box mt={3} pl={1.5} fontSize="caption.fontSize" color="error.main">{helperText}</Box>
    </Box>
    <AttachmentIconField name={name} disabled={disabled}  />
  </Box>
);

export default withOnChange(withLabelRenderer(FBFileUpload));
