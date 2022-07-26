import { Box, Link } from "@material-ui/core";
import React from "react";
import { FBHyperlinkProps, FBInput } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBHyperlink } from "./FBHyperlink.wrap";

const FBHyperlink: React.FunctionComponent<FBHyperlinkProps> = ({
  linkUrl,
  onClick,
  label,
  ...props
}) => (
  <FBInput {...props} type="hyperlink">
    <Link rel="noopener" {...{ onClick }} underline="always" style={{ textDecorationColor: `${Colors.almost_black}` }}>
      <Box fontSize={12} fontWeight= {600} lineHeight="15px" color={Colors.almost_black}>{label}</Box>
    </Link>
  </FBInput>
);

export default withFBHyperlink(FBHyperlink);
