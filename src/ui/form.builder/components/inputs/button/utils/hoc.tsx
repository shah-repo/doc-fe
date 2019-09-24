import React from "react";
import { Subtract } from "../../../common/utils/types";
import { FBInjectedButtonProps, FBButtonProps } from "./types";

export function withButtonDefaults<T extends FBButtonProps>(
  Component: React.ComponentType<T>,
) {
  class HOC extends React.Component<Subtract<T, FBInjectedButtonProps>> {
    public render() {
      return (
        <Component
          {...(this.props as T)}
          variant="contained"
          color="secondary"
        />
      );
    }
  }

  return HOC;
}
