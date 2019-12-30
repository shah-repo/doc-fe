import { render as rtlRender } from "@testing-library/react";
// tslint:disable-next-line: no-implicit-dependencies
import { createMemoryHistory } from "history";
import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createStoreWithValues } from "../../../state/store";
import messagesEn from "../../translations/en.json";

addLocaleData([...localeEn]);

const messages = {
  en: messagesEn,
};

const language = "en";

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
