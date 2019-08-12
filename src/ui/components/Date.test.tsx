import { mount } from "enzyme";
import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import messagesEn from "../translations/en.json";
import DateFormatter, { DateFormatterProps } from "./Date";

addLocaleData([...localeEn]);

const messages = {
  en: messagesEn,
};

const language = "en";

describe("DateFormatter component unit tests", () => {
  const getDate = (props: DateFormatterProps) => mount(
    <IntlProvider locale={language} messages={messages[language]}>
      <DateFormatter {...props} />
    </IntlProvider>,
  ).text();

  it("displays null", () => {
    expect(getDate({ value: undefined })).toEqual('');
  });

  it("displays formatted date", () => {
    expect(getDate({ value: '2019-05-31' })).toEqual('5/31/2019');
  });
});
