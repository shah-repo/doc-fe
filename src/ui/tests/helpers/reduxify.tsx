import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "./makeStore";

export const reduxify = (Component: React.FunctionComponent, props = {}, state = {}) => {
  return function reduxWrap() {
    return (
      <Provider store={makeStore(state)}>
        <Component {...props} />
      </Provider>
    );
  };
};
