import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { makeStore } from "./makeStore";

export const reduxify = <P extends any>(
  Component: React.FunctionComponent<P>,
  props: P = {} as P,
  state = {},
) => {
  return function reduxWrap() {
    const store = makeStore(state);
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Component {...props} />
        </BrowserRouter>
      </Provider>
    );
  };
};
