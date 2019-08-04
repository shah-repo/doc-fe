import { mount } from "enzyme";
import { Formik } from "formik";
import React from "react";
import FilledInputField from "../../../../components/forms/fields/FilledInput";
import { Presenter, Props } from "../presenter";

jest.mock("../../../../components/Text");

describe("Assessment presenter unit test", () => {
  const defaultProps = {
    classes: {
      exampleClass: "",
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
        documentRevisions: [],
      },
    },
  };

  const getWrapper = (props: Props) => mount(
      <Formik
        onSubmit={() => {}}
        initialValues={{}}
      >
        <Presenter {...defaultProps} {...props}/>
      </Formik>,
  );

  it("Field is multiline", () => {
    const wrapper = getWrapper({});
    const inputProps = { multiline: true, rows: "2" };
    expect(wrapper.find(FilledInputField).prop("inputProps")).toEqual(inputProps);
  });
});
