import { css } from "glamor";
import * as React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import "react-virtualized/styles.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../../state/store";
import Theme from "../layout/theme/provider";
import messagesEn from "../translations/en.json";
import "./app.css";
import AppPresenter from "./App.presenter";

addLocaleData([...localeEn]);

const messages = {
  en: messagesEn,
};

const language = "en";

toast.configure({
  autoClose: false,
  toastClassName: css({
    background: "#eee !important",
    color: "#333 !important",
    borderRadius: "10px !important",
    boxShadow: "0 1px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 15px 0 rgba(0, 0, 0, 0.2) !important",
  }),
});

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
