import React from "react";
import { view } from "react-easy-state";
import { FBStateInitialValues } from "../utils/helpers";
import formBuilderStore from "../utils/store";
import { FBStateProps, FBStoreProps, Subtract } from "../utils/types";

export function withFormBuilderStore<T extends FBStoreProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBStoreProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          state={formBuilderStore.state}
          getState={this.get}
          setState={this.set}
          setStates={this.setStates}
          removeState={this.remove}
          clearStates={this.clear}
        />
      );
    }

    private get = (key: keyof FBStateProps) => formBuilderStore.state[key];
    private set = (key: keyof FBStateProps, value: any) => formBuilderStore.state[key] = value;
    private setStates = (values: FBStateProps) => {
      const state = formBuilderStore.state;
      formBuilderStore.state = {...state, ...values};
    }
    private remove = (key: keyof FBStateProps) => {
      const state = formBuilderStore.state;
      delete formBuilderStore.state[key];
      formBuilderStore.state = state;
    }
    private clear = () => formBuilderStore.state = FBStateInitialValues;
  }

  return view(HOC);
}
