import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import { Item, Props } from "../item";

jest.mock("../../../../components/Text");

describe("Assessment item unit test", () => {
  const defaultProps = {
    classes: {
      exampleClass: "",
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
        documentRevisions: [],
      },
    },
  };
  const getWrapper = (props: Partial<Props>) => mount(
    <Item {...defaultProps} {...props} />,
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
                updatedAt: "",
              },
              createdAt: "",
              id: "",
              importMetadataJson: {},
              name: "",
              s3link: "",
              type: "",
              updatedAt: "",
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
        documentRevisions: [],
      },
    };
    const wrapper = getWrapper({ form });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders resoningRenderer correctly", () => {
    const wrapper = getWrapper({});
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
