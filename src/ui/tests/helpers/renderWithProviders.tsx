import { render as rtlRender } from "@testing-library/react";
// eslint-disable-next-line: no-implicit-dependencies
import { createMemoryHistory, MemoryHistory } from "history";
import React from "react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { DeepPartial, Store } from "redux";
import { ApplicationState } from "../../../state/reducers";
import { createStoreWithValues } from "../../../state/store";
import messagesEn from "../../translations/en.json";

const messages = {
  en: messagesEn,
};

const language = "en";

interface ProviderProps {
  customState?: DeepPartial<ApplicationState>;
  store?: Store<ApplicationState>;
  route?: string;
  history?: MemoryHistory<any>;
}

const render = (
  ui: React.ReactElement,
  {
    customState = {},
    store = createStoreWithValues(customState),
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  }: ProviderProps = {},
) => {
  const Providers = ({ children }: any) => (
    <Provider store={store}>
      <IntlProvider locale={language} messages={messages[language]}>
        <Router history={history}>
          {children}
        </Router>
      </IntlProvider>
    </Provider>
  );

  return {
    ...rtlRender(ui, { wrapper: Providers }),
    history,
    store,
  };
};

export default render;
