import { Checkbox } from "@material-ui/core";
import React from "react";
import { FBCheckboxInjectedProps, FBCheckboxProps } from "../types/checkbox";
import { Subtract } from "../types/common";
import { withLabelRenderer } from "./withLabelRenderer";
import { withOnChange } from "./withOnChange";

export function withCheckboxDefaults<T extends FBCheckboxProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBCheckboxInjectedProps>> {

    public render() {
      const { field } = this.props;

      const checkboxRenderer = <Checkbox checked={field.value} />;

      return (
        <Component
          {...this.props as T}
          control={checkboxRenderer}
        />
      );
    }
  }

  return withOnChange(withLabelRenderer(HOC));
}
