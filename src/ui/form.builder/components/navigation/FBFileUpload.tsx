import { Box } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React, { Fragment } from "react";
import AttachmentField from "../../../components/common/attachment.field/container";
import AttachmentIconField from "../../../components/common/attachment.icon/container";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import formBuilderStore from "../../stores/FBStore";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

export type Props = Omit<OutlinedTextFieldProps, "variant"> &
  FBFormDefaultProps &
  FBOnChangeProps;

const FBFileUpload: React.FunctionComponent<Props> = ({
  labelRenderer,
  form,
  field,
  name,
}) => (
  <Box mb={5} width="100%">
    {labelRenderer}
    <AttachmentField name={name} component="field" />
    <AttachmentIconField name={name}  />
  </Box>
);

export default withOnChange(withLabelRenderer(FBFileUpload));
