import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../../state/store";
import AppPresenter from "./App";
import Theme from "./Theme";

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Theme>
          <AppPresenter />
        </Theme>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
