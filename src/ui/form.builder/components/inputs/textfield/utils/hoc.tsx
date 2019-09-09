import React from "react";
import { Subtract } from "../../../common/utils/types";
import { FBTextFieldInjectedProps } from "./types";

export function withTextFieldSettings<T extends FBTextFieldInjectedProps>(
  Component: React.ComponentType<T>,
) {

  return class extends React.Component<Subtract<T, FBTextFieldInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          variant="outlined"
        />
      );
    }
  };
}
