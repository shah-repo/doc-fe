import React from "react";
import { withElOnChange } from "../../../common/hoc/withElOnChange";
import { withLabelRenderer } from "../../../common/hoc/withLabelRenderer";
import { Subtract } from "../../../common/utils/types";
import { FBTextFieldInjectedProps, FBTextFieldProps } from "./types";

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

  return withElOnChange(withLabelRenderer(HOC));
}
