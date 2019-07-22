import React from "react";
import { mount } from "enzyme";
import  Form from "../form";
import { Formik } from "formik";
import FilledInputField from "../../../components/forms/fields/FilledInput";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import messagesEn from "../../../translations/en.json";
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("Assessment form unit test", () => {
  addLocaleData([...localeEn]);
  const messages = { en: messagesEn };
  const language = "en";

  const initialState = {};
  const store = mockStore(initialState);

  const defaultProps:Props = {
    classes: {
      exampleClass: ""
    },
    type: "design"
  }

  const getWrapper = (props: Partial<Prpos>) => mount (
    <Provider store={store}>
      <IntlProvider locale={language} messages={messages[language]}>
        <Formik>
          <Form {...defaultProps} {...props}/>
        </Formik>
      </IntlProvider>
    </Provider>
  );

  it("Displays Form correctly", () => {
    const wrapper = getWrapper({});
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Textfield is multiline", () => {
    const wrapper = getWrapper({});
    const inputProps = { multiline: true, rows: "2" };
    expect(wrapper.find(FilledInputField).prop("inputProps")).toEqual(inputProps);
  })
})
