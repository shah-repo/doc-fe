import { render as rtlRender } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createStoreWithValues } from "../../../state/store";

const render = (
  ui: any,
  {
    customState = {},
    store = createStoreWithValues(customState),
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  }: any = {},
) => {
  const Providers = ({ children }: any) => (
    <Provider store={store}>
      <Router history={history}>
        {children}
      </Router>
    </Provider>
  );

  return {
    ...rtlRender(ui, { wrapper: Providers }),
    history,
  };
}

export default render;
