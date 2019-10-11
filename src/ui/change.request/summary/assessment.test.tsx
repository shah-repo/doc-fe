import { shallow } from "enzyme";
import React from "react";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";
import { Assessment,   Props } from "./assessment";
import AttachmentField from "../../components/common/attachment.icon/container";
import { Box } from "@material-ui/core";

describe("Assessment tests", () => {
  const defaultProps: Props = {
    dataProp: {
      design: {
        reasoning: "Test reasoning",
        attachments: [getAttachment()],
      },
      process: {
        reasoning: "No Attachment",
        attachments: [],
      },
      regulatory: {
        reasoning: "No Attachment",
        attachments: [],
      },
    },
    classes: {
      box: "",
      assessmentItem: "",
      assessments: "",
    },
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <Assessment {...defaultProps} {...props}/>,
  );

  it("Dispalys correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(AttachmentField)).toHaveLength(1);
    expect(wrapper.find(Box)).toHaveLength(3);
  });
});
