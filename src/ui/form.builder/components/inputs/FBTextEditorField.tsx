import { Box } from "@material-ui/core";
import React from "react";
import TextEditorField, {
  TextEditorFieldProps,
} from "../../../components/forms/fields/TextEditor";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { FBFormDefaultProps } from "../../types/common";

type Props = TextEditorFieldProps & FBFormDefaultProps;

const FBTextEditorField: React.FunctionComponent<Props> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <TextEditorField {...props} label="" />
  </Box>
);

export default withLabelRenderer(FBTextEditorField);
