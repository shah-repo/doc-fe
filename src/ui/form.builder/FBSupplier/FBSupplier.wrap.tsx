import React from "react";

export const withFBSupplier = (
  Component: React.FunctionComponent,
) => {
  const Comp = ({
    ...props
  }) =>

  // MARK: @config

  // MARK: @reactions

  // MARK: @helpers

  // MARK: @methods

  // MARK: @observer

    Component({
      ...(props),
    })
  ;

  Comp.displayName = "withFBSupplier";
  return Comp;
};
