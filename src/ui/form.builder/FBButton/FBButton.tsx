import { Button } from "@material-ui/core";
import React from "react";
import { FBButtonProps } from ".";
import Text from "../../components/Text";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label,
  color = "secondary",
  variant = "contained",
  dataCy = "fb-control-btn",
  gutter,
  hidden,
  style,
  ...props
}) => (
  <Button
    {...{ color, variant }}
    {...props}
    type="button"
    data-cy={dataCy}
    style={{
      ...style,
      ...hidden && { display: "none" },
    }}
  >
    {label && <Text message={label} />}
  </Button>
);

export default FBButton;
