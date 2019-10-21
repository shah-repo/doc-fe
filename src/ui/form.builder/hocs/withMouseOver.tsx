import { BoxProps } from "@material-ui/core/Box";
import React from "react";
import formBuilderStore from "../stores/FBStore";
import { Subtract } from "../types/common";

export function withMouseOver<T extends BoxProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, BoxProps>> {

    public state: Pick<BoxProps, "visibility"> = {
      visibility: "hidden",
    };

    public render() {
      return (
        <Component
          {...this.props as T}
          visibility={this.state.visibility}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    private onMouseOver = () => {
      if (formBuilderStore.mode === "design") {
        this.setState({ visibility: "visible" });
      }
    }

    private onMouseLeave = () => {
      this.setState({ visibility: "hidden" });
    }
  }
  return HOC;
}
