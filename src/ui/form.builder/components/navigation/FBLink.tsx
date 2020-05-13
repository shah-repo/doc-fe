import { Link } from "@material-ui/core";
import React from "react";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBLink: React.FunctionComponent<FBInputProps> = ({
  linkUrl = "https://",
  disabled,
  ...props
}) => (
  <FBInput {...props} type="hyperlink">
    <Link
      component="button"
      variant="body2"
      rel="noopener"
      style={{ textAlign: "left" }}
      onClick={() => {
        !disabled && window.open(linkUrl.includes("http") ? linkUrl : `https://${linkUrl}`);
      }}
    >
      {linkUrl}
    </Link>
  </FBInput>
);

export default FBLink;
