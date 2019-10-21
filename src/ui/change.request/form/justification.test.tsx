import { shallow } from "enzyme";
import React from "react";
import { Justification, Props } from "./justification";
import faker from "faker";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import TextEditorField from "../../components/forms/fields/TextEditor";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";

describe("Justification with attachments tests", () => {
  const defaultProps: Props = {
    form: {
      values: {
        justifications: {
          description: "",
          attachments: [getAttachment()],
        },
        },
      },
    } as Props;

  const getWrapper = (props: Partial<Props>= {}) => shallow (
    <Justification {...defaultProps} {...props} />,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(AttachmentIconField).exists()).toEqual(true);
  });
});

describe("Justification without attachments tests", () => {
  const defaultProps: Props = {
    form: {
      values: {
        justifications: {
          description: faker.lorem.paragraph(),
          attachments: [],
        },
        },
      },
    } as Props;

  const getWrapper = (props: Partial<Props>= {}) => shallow (
    <Justification {...defaultProps} {...props} />,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(TextEditorField).exists()).toEqual(true);
  });
});
