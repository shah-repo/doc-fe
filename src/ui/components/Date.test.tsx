import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { TIME_ZONE } from '../../common/utils/date';
import { store } from '../../state/store';
import messagesEn from '../translations/en.json';
import DateFormatter, { DateFormatterProps } from './Date';

const messages = {
  en: messagesEn,
};

const language = 'en';

describe('DateFormatter component unit tests', () => {
  const getDate = (props: DateFormatterProps) => mount(
    <Provider store={store}>
      <IntlProvider locale={language} timeZone={TIME_ZONE} messages={messages[language]}>
        <DateFormatter {...props} timeZone={TIME_ZONE} />
      </IntlProvider>
    </Provider>,
  ).text();

  it('displays null', () => {
    expect(getDate({ value: undefined })).toEqual('');
  });
  // test will probably fail in different time zones
  it('displays formatted date', () => {
    const date = new Date(2019, 4, 31);
    expect(getDate({ value: date })).toEqual('5/30/2019');
  });
});
