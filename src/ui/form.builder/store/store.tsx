import React from "react";
import { Subtract } from "../components/common/utils/types";
import { FBContextInitialValues } from "./helpers";
import { FBContextProps, FBStoreProps } from "./types";

const StoreContext = React.createContext(FBContextInitialValues);

function createStore<T extends FBStoreProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.Component<Subtract<T, FBStoreProps>> {

    public state: FBStoreProps = {
      ...FBContextInitialValues,
      get: (key: keyof FBContextProps) => this.state[key],
      set: (key: keyof FBContextProps, value: any) => this.setState({...this.state, [key]: value}),
      remove: (key: keyof FBContextProps) => {
        const state = this.state;
        delete state[key];
        this.setState(state);
      },
    };

    public render() {
      return (
        <StoreContext.Provider value={this.state}>
          <Component {...this.props as T} />
        </StoreContext.Provider>
      );
    }
  };
}

function withStore<T extends FBStoreProps>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {
    return (
      <StoreContext.Consumer>
        {(context) => <Component store={context} {...props} />}
      </StoreContext.Consumer>
    );
  };
}

export { createStore, withStore };
