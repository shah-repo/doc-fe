import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'react-virtualized/styles.css';
import { PersistGate } from 'redux-persist/integration/react';
import { currentLocaleMessages, locale } from '../../common/intl';
import { persistor, store } from '../../state/store';
import Theme from '../layout/theme/provider';
import './app.css';
import AppPresenter from './App.presenter';
import './ConsoleToaster';

const AppContainer: React.FunctionComponent = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Theme>
        <IntlProvider locale={locale} messages={currentLocaleMessages}>
          <BrowserRouter>
            <AppPresenter />
          </BrowserRouter>
        </IntlProvider>
      </Theme>
    </PersistGate>
  </Provider>
);

export default AppContainer;
