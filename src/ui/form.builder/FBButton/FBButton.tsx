import { Button } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBButtonProps, FBLabelLocaleProps, FBText } from "..";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
  color = "secondary",
  variant = "contained",
  dataCy = "fb-control-btn",
  gutter,
  hidden,
  style,
  className,
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
    className={className}>
    {isString(label) && (
      <FBText labelProps={{ fontFamily: "Sora" }} locale={label} />
    )}
    {hasIn(label, "locale") && (
      <FBText
        labelProps={{ fontFamily: "Sora" }}
        locale={(label as FBLabelLocaleProps).locale}
        values={(label as FBLabelLocaleProps).values}
      />
    )}
  </Button>
);

export default FBButton;
