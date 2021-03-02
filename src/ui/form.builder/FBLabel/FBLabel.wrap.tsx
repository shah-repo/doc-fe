import { get, isUndefined } from "lodash";
import React from "react";
import { FBLabelFontSize, FBLabelProps } from "..";

export const withFBLabel = <T extends FBLabelProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fontSize = "md",
    ...props
  }: T) => {

    !isUndefined(get(FBLabelFontSize, fontSize)) && (
      fontSize = `${get(FBLabelFontSize, fontSize)}.fontSize`
    );

    return Component({
      ...(props as T),
      fontSize,
    });
  };

  return (props: T) => Comp(props);
};
