import cx from "classnames";
import React from "react";
import { Button } from "..";
import { withThemeNext } from "../../../../layout/theme-next";
import { useButtonType } from "../Button/Button.utils";
import useStyles from "./IconButton.styles";
import { IconButtonProps } from "./IconButton.types";

const IconButton: React.FC<IconButtonProps> = ({
  kind = "primary",
  size = 16,
  variant,
  color,
  children,
  className,
  ...props
}, ref) => {
  const [muiVariant, muiColor] = useButtonType<IconButtonProps["kind"]>(
    kind,
    {
      square: ["text", "default"],
      simple: ["text", "default"],
      boxed: ["contained", "default"],
      destructive: ["text", "default"],
    },
  );
  const classes = useStyles({ size });
  const isSquare = kind && ["square", "boxed", "destructive"].includes(kind);
  const isBoxed = kind === "boxed";
  const isSimple = kind === "simple";
  const isDesctructive = kind === "destructive";

  return (
    <Button
      {...props}
      ref={ref}
      variant={variant ?? muiVariant}
      color={color ?? muiColor}
      className={cx(
        classes.button,
        {
          [classes.square]: isSquare,
          [classes.simple]: isSimple,
          [classes.boxed]: isBoxed,
          [classes.destructive]: isDesctructive,
        },
        className
      )}
    >
      {children}
    </Button>
  );
};

export default withThemeNext(React.forwardRef(IconButton));
