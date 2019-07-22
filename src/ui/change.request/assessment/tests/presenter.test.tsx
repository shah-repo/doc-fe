import { mount } from "enzyme";
import React from "react";
import Presenter from "../presenter";
import FilledInputField from "../../../components/forms/fields/FilledInput";
import { Formik, FormikErrors, FormikProps } from "formik";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import messagesEn from "../../../translations/en.json";

describe("Assessment presenter unit test", () => {
  addLocaleData([...localeEn]);
  const messages = { en: messagesEn };
  const language = "en";

  const defaultProps = {
    classes: {
      exampleClass: ""
    },
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
        documentRevisions:[],
      }
    }
  }

  const getWrapper = (props: Props<Props>) => mount(
    <IntlProvider locale={language} messages={messages[language]}>
      <Formik>
        <Presenter {...defaultProps} {...props}/>
      </Formik>
    </IntlProvider>
  );

  it("Displays Presenter correctly", () => {
    const wrapper = getWrapper({});
    expect(wrapper.html()).toMatchSnapshot();
  })

  it("Field is multiline", () => {
    const wrapper = getWrapper({});
    const inputProps = { multiline: true, rows: "2" };
    expect(wrapper.find(FilledInputField).prop("inputProps")).toEqual(inputProps);
  })
})
