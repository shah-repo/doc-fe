import * as React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../../state/store";
import messagesEn from "../translations/en.json";
import AppPresenter from "./App";
import Theme from "./Theme";

addLocaleData([...localeEn]);

const messages = {
  en: messagesEn,
};

const language = "en";

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Theme>
        <IntlProvider locale={language} messages={messages[language]}>
          <BrowserRouter>
            <AppPresenter />
          </BrowserRouter>
        </IntlProvider>
      </Theme>
    </PersistGate>
  </Provider>
);

export default App;
