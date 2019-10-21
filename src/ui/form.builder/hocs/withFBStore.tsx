import { observer } from "mobx-react";
import React from "react";
import formBuilderStore from "../stores/FBStore";
import { Subtract } from "../types/common";
import { FBStoreProps } from "../types/store";

export function withFBStore<T extends FBStoreProps>(
  Component: React.ComponentType<T>,
) {

  @observer
  class HOC extends React.Component<Subtract<T, FBStoreProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          formBuilderStore={formBuilderStore}
        />
      );
    }
  }
  return HOC;
}
