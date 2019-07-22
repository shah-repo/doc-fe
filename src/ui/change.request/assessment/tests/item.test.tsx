import { mount } from "enzyme";
import React from "react";
import Item from "../item";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import messagesEn from "../../../translations/en.json";

describe("Assessment item unit test", () => {
  addLocaleData([...localeEn]);
  const messages = { en: messagesEn };
  const language = "en";

  const defaultProps = {
    classes: {
      exampleClass: ""
    },
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
        documentRevisions:[],
      }
    }
  }
  const getWrapper = (props: Partial<Prpos>) => mount(
    <IntlProvider locale={language} messages={messages[language]}>
      <Item {...defaultProps} {...props}/>
    </IntlProvider>
  );

  it("renders attachmentRenderer correctly", () => {
    const form = {
      values: {
        description: "",
        justifications: {
          description: "",
          attachments: [],
        },
        assessments: {
          description: "",
          design: {
            attachment: {
              company: {
                createdAt: "",
                id: "",
                maxRevisionStages: 3,
                name: "",
                updatedAt: ""
              },
              createdAt: "",
              id:"",
              importMetadataJson: {},
              name: "",
              s3link: "",
              type: "",
              updatedAt: ""
            },
          },
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
    const wrapper = getWrapper({ form });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders resoningRenderer correctly", () => {
    const wrapper = getWrapper({});
    expect(wrapper.html()).toMatchSnapshot();
  });
});
