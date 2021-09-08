import { Button } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import { hasIn, isEqual, isString } from "lodash";
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
  iconType,
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
    {isEqual(iconType, "download") && (
      <GetApp width={20} height={20} style={{ marginRight: 4 }}/>
    )}
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
