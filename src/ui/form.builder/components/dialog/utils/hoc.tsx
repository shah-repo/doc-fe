import React from "react";
import { FBInjectedProps } from "./types";

type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export function withDialogHelper<T extends FBInjectedProps>(Component: React.ComponentType<T>) {
  return class extends React.Component<Subtract<T, FBInjectedProps>> {
    public state = { open: false as boolean };

    public setOpen = () => this.setState({ open: true });
    public setClose = () => this.setState({ open: false });

    public render() {
      return (
        <Component
          {...this.props as T}
          setOpen={this.setOpen}
          setClose={this.setClose}
          open={this.state.open}
        />
      );
    }
  };
}
