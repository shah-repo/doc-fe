import { isString } from "lodash";
import React, { useMemo } from "react";
import { FBData, FBIconProps, FBIconType } from "..";

export const withFBIcon = <T extends FBIconProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    boxProps,
    icon,
    ...props
  }: T) => {

    const icons = useMemo(() => FBData.icons(boxProps?.color), [boxProps]);
    isString(icon) && (icon = icons[icon as FBIconType]);

    return Component({
      ...(props as T),
      boxProps,
      icon,
    });
  };

  Comp.displayName = "withFBIcon";
  return Comp;
};
