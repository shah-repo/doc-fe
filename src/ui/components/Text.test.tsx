import { mount, ReactWrapper } from "enzyme";
import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import messagesEn from "../translations/en.json";
import Text, { TextProps } from "./Text";

addLocaleData([...localeEn]);

const messages = {
  en: messagesEn,
};

const language = "en";

describe("Text component unit tests", () => {
  const getText = (props: TextProps) => mount(
    <IntlProvider locale={language} messages={messages[language]}>
      <Text {...props} />
    </IntlProvider>,
  ).text();

  it("displays translation", () => {
    expect(getText({ translation: "login.title" })).toEqual(messagesEn["login.title"]);
  });

  it("displays raw message", () => {
    const message = "simple test message";
    expect(getText({ message })).toEqual(message);
  });

  it("displays translation when message is translation", () => {
    expect(getText({ message: "login.title" })).toEqual(messagesEn["login.title"]);
  });
});
