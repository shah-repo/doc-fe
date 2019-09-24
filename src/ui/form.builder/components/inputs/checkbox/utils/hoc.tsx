import { Checkbox } from "@material-ui/core";
import React from "react";
import { withElOnChange } from "../../../common/hoc/withElOnChange";
import { withLabelRenderer } from "../../../common/hoc/withLabelRenderer";
import { Subtract } from "../../../common/utils/types";
import { FBCheckboxInjectedProps, FBCheckboxProps } from "./types";

export function withCheckboxDefaults<T extends FBCheckboxProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBCheckboxInjectedProps>> {

    public render() {
      const { field } = this.props;
      const checkboxRenderer = (
        <Checkbox
          checked={field.value}
        />
      );
      return (
        <Component
          {...this.props as T}
          control={checkboxRenderer}
        />
      );
    }
  }

  return withElOnChange(withLabelRenderer(HOC));
}
