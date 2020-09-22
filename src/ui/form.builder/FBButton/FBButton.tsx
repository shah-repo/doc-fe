import { Button } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBButtonProps } from ".";
import { FBLabelLocaleProps, FBText } from "..";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
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
    {isString(label) && (
      <FBText locale={label} />
    )}
    {hasIn(label, "locale") && (
      <FBText
        locale={(label as FBLabelLocaleProps).locale}
        values={(label as FBLabelLocaleProps).values}
      />
    )}
  </Button>
);

export default FBButton;
