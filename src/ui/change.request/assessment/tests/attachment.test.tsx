import { mount } from "enzyme";
import React from "react";
import Attachment from "../attachment";
import { Formik } from "formik";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import { ASYNC_DEFAULT_STATE } from "../../../hooks/useAsync";
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import messagesEn from "../../../translations/en.json";
import { act } from 'react-dom/test-utils';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("Assessment attachment unit tests", () => {
  addLocaleData([...localeEn]);
  const messages = { en: messagesEn };
  const language = "en";

  const initialState = {
    upload: jest.fn(),
  };
  const store = mockStore(initialState);

  const defaultProps = {
    type: "design",
    form: {
    values: {
      description: "",
        justifications: {
          description: "",
          attachments: [],
        },
        assessments: {
          description: "",
          design: {},
          process: {},
          regulatory: {},
        },
        implementationPlan: {
          attachments: [],
          tasks: [],
        },
        approvals: [],
        documentRevisions:[],}
      }
  };
  const getWrapper = (props: Partial<Props>) => mount (
    <Provider store={store}>
      <IntlProvider locale={language} messages={messages[language]}>
        <Attachment {...defaultProps} {...props}/>
      </IntlProvider>
    </Provider>
  );

  it("setAsyncState for FormMessage", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(Formik).find(FormMessage).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("setAsyncState for FormProgress", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(Formik).find(FormProgress).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("setAsyncState for SubmitButton", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(Formik).find(SubmitButton).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("Sets Formik initialValues", () => {
    const initialValues = {
      file: undefined
    };
    const wrapper = getWrapper({});
    expect(wrapper.find(Formik).prop("initialValues")).toEqual(initialValues);
  })
});
