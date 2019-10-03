import React from "react";
import { Subtract } from "../types/common";
import { FBTextFieldInjectedProps, FBTextFieldProps } from "../types/textfield";
import { withLabelRenderer } from "./withLabelRenderer";
import { withOnChange } from "./withOnChange";

export function withTextFieldDefaults<T extends FBTextFieldProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBTextFieldInjectedProps>> {

    public render() {
      return (
        <Component
          fullWidth={true}
          {...this.props as T}
          variant="outlined"
          label=""
        />
      );
    }
  }

  return withOnChange(withLabelRenderer(HOC));
}
