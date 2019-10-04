import React from "react";
import { Subtract } from "../types/common";
import { FBDialogInjectedProps } from "../types/dialog";

export function withDialogState<T extends FBDialogInjectedProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.Component<Subtract<T, FBDialogInjectedProps>> {
    public state = { open: false as boolean, content: undefined };

    public setOpen = () => this.setState({ open: true });
    public setClose = () => this.setState({ open: false });
    public setChildren = (el: React.ReactNode) => this.setState({ ...this.state, content: el });

    public render() {
      return (
        <Component
          {...this.props as T}
          setDialogOpen={this.setOpen}
          setDialogClose={this.setClose}
          setDialogChildren={this.setChildren}
          open={this.state.open}
          content={this.state.content}
        />
      );
    }
  };
}
