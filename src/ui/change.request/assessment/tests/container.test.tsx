import { mount } from "enzyme";
import { Formik, Field } from "formik";
import React from "react";
import Container, { Props } from "../container";
import Presenter from "../presenter";

jest.mock("../../../components/Text");

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

  const getWrapper = (props: Partial<Props>) => mount(
    <Formik
      initialValues={{}}
      onSubmit={jest.fn()}
    >
      <Field render={(fieldProps: any) => <Container {...fieldProps} {...defaultProps} {...props}/>} />
    </Formik>
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
