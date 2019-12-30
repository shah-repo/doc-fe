import { render as rtlRender } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStoreWithValues } from "../../../state/store";

const render = (ui: any, initialStore = {}, options = {}) => {
  const store = createStoreWithValues(initialStore);
  const Providers = ({ children }: any) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );

  return rtlRender(ui, { wrapper: Providers, ...options });
};

export default render;
