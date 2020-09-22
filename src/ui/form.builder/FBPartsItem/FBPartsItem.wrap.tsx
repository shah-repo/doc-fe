import React from "react";
import { FBPartsItemProps } from "./FBPartsItem.types";


export const withFBPartsItem = <T extends FBPartsItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    value,
    ...props
  }: T) =>

  // MARK: @config

  // MARK: Reactions


  // MARK: @helpers


  // MARK: @methods

  // MARK: @observer

    Component({
      ...(props as T),
      value,
    })
  ;

  Comp.displayName = "withFBPartsItem";
  return Comp;
};
