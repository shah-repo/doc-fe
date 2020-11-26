import React from "react";
import { FBRangeProps } from ".";

export const withFBRange = <T extends FBRangeProps>(
  Component: React.FunctionComponent,
) => {
  const Comp = ({
    isVisible,
  }) => {
    // MARK: @config

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer


    if (!isVisible) {
      return null;
    }
    return Component({});
  };

  Comp.displayName = "withFBRange";
  return Comp;
};
