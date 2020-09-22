import React from "react";
import { FBProcedureAssetProps } from "..";

export const withFBProcedureAsset = <T extends FBProcedureAssetProps>(
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

  Comp.displayName = "withFBProcedureAsset";
  return Comp;
};
