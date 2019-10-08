import { Box } from "@material-ui/core";
import React from "react";
import TextEditorField from "../../../components/forms/fields/TextEditor";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { FBFormDefaultProps } from "../../types/common";

const FBTextEditorField: React.FunctionComponent<FBFormDefaultProps> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <TextEditorField name="" {...props} label="" />
  </Box>
);

export default withLabelRenderer(FBTextEditorField);
