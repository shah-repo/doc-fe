import React from "react";
import { FBPartsProps } from "./FBParts.types";

export const withFBParts = <T extends FBPartsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) =>

  // MARK: @config


  // MARK: Reactions


  // MARK: @helpers


  // MARK: @methods

  // MARK: @observer

    Component({
      ...(props),
    })
  ;

  Comp.displayName = "withFBParts";
  return Comp;
};
