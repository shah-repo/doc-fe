import { Link } from "@material-ui/core";
import React from "react";
import { FBHyperlinkProps, FBInput } from "..";
import { withFBHyperlink } from "./FBHyperlink.wrap";

const FBHyperlink: React.FunctionComponent<FBHyperlinkProps> = ({
  linkUrl,
  onClick,
  ...props
}) => (
  <FBInput {...props} type="hyperlink">
    <Link
      variant="body2"
      rel="noopener"
      {...{ onClick }}
    >
      {linkUrl}
    </Link>
  </FBInput>
);

export default withFBHyperlink(FBHyperlink);
