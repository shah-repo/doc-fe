import { Button } from "@material-ui/core";
import cx from "classnames";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBButtonProps, FBLabelLocaleProps, FBText } from "..";
import FBButtonStyles from "./FBButton.styles";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
  color = "secondary",
  variant = "contained",
  dataCy = "fb-control-btn",
  gutter,
  hidden,
  isHover = false,
  showNewButton = false,
  style,
  size,
  className,
  newVariant,
  ...props
}) => {
  const classes = FBButtonStyles({ isHover, newVariant, size });
  if (showNewButton) {
    return (
      <Button
        {...{ color, variant }}
        {...props}
        type={props.type ?? "button"}
        data-cy={dataCy}
        style={{
          ...style,
          ...hidden && { display: "none" },
        }}
        classes={{
          root: classes.root,
          label: classes.label,
        }}
        className={className}
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
  }

  return (
    <Button
      {...{ color, variant, size }}
      {...props}
      type={props.type ?? "button"}
      data-cy={dataCy}
      style={{
        ...style,
        ...hidden && { display: "none" },
      }}
      className={cx(classes.fbBtn, className)}
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
};

export default FBButton;
