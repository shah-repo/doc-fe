import { Box, Link } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { withOnChange } from "../../hocs/withOnChange";
import { FBFormDefaultProps, FBOnChangeProps } from "../../types/common";

export type Props = Omit<OutlinedTextFieldProps, "variant"> &
  FBFormDefaultProps &
  FBOnChangeProps;

const FBLink: React.FunctionComponent<Props> = ({ labelRenderer, linkUrl }) => (
  <Box mb={4} width="100%">
    {labelRenderer}
    <Link
      component="button"
      variant="body2"
      rel="noopener"
      onClick={() => {
        window.open(linkUrl!.includes("http") ? linkUrl : `https://${linkUrl}`);
      }}
    >
      {linkUrl}
    </Link>
  </Box>
);

export default withOnChange(withLabelRenderer(FBLink));
