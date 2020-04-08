import _ from "lodash";
import React from "react";
import { FBLabelFontSize, FBLabelProps } from "./FBLabel.types";

export const withFBLabel = <T extends FBLabelProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fontSize = "md",
    ...props
  }: T) => {

    !_.isUndefined(_.get(FBLabelFontSize, fontSize)) && (
      fontSize = `${_.get(FBLabelFontSize, fontSize)}.fontSize`
    );

    return Component({
      ...(props as T),
      fontSize,
    });
  };

  return (props: T) => Comp(props);
};
