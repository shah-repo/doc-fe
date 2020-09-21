import React from "react";
import { FBProcedureProps } from "..";

export const withFBProcedure = <T extends FBProcedureProps>(
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

  Comp.displayName = "withFBProcedure";
  return Comp;
};
