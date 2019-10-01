import React from "react";
import { FBStatesInitialValues } from "./helpers";
import { FBStateProps, Subtract } from "./types";

export function withStates<T extends FBStateProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.Component<Subtract<T, FBStateProps>> {
    public state = FBStatesInitialValues;

    public render() {
      return (
        <Component
          {...this.props as T}
          initial={this.state.initial}
          setState={this.set}
        />
      );
    }

    private set = (key: keyof FBStateProps, value: any) =>
      this.setState({...this.state, [key]: value})
  };
}
