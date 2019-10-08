import { Box } from "@material-ui/core";
import React from "react";
import TextEditorField from "../../../components/forms/fields/TextEditor";
import { FBTextEditorFieldProps } from "../../types/editorfield";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";

const FBTextEditorField: React.FunctionComponent<FBTextEditorFieldProps> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <TextEditorField name={props.label!} {...props} />
  </Box>
);

export default withLabelRenderer(FBTextEditorField);
