import * as React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-virtualized/styles.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../../state/store";
import Theme from "../layout/theme/provider";
import messagesEn from "../translations/en.json";
import "./app.css";
import AppPresenter from "./App.presenter";
import "./ConsoleToaster";

const messages = {
  en: messagesEn,
};

const language = "en";

const AppContainer: React.FunctionComponent = () => (
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

export default AppContainer;
