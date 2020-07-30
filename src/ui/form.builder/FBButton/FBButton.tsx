import { Button } from "@material-ui/core";
import React from "react";
import { FBButtonProps } from ".";
import Text from "../../components/Text";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
  color = "secondary",
  variant = "contained",
  gutter,
  hidden,
  style,
  dataCy,
  ...props
}) => (
    <Button
      {...{ color, variant }}
      {...props}
      type="button"
      data-cy={dataCy ? dataCy : 'fb-control-btn'}
      style={{
        ...style,
        ...hidden && { display: "none" },
      }}
    >
      {label && <Text message={label} />}
    </Button>
  );

export default FBButton;
