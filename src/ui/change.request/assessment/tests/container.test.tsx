import { shallow } from "enzyme";
import React from "react";
import Container from "../container";
import Presenter from "../presenter";

describe("Assessment container unit tests", () => {
  const defaultProps = {
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
  };

  const getWrapper = (props: Partial<Props>) => shallow(
    <Container {...defaultProps} {...props}/>
  );

  it("Displays presenter", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(Presenter)).toHaveLength(1);
  });

  it("Sets form prop", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(Presenter).prop("form")).toEqual(defaultProps.form);
  });
});
