import { mount } from "enzyme";
import { Field, Formik } from "formik";
import React from "react";
import FormMessage from "../../../../components/forms/FormMessage";
import FormProgress from "../../../../components/forms/FormProgress";
import SubmitButton from "../../../../components/forms/SubmitButton";
import { ASYNC_DEFAULT_STATE } from "../../../../hooks/useAsync";
import { Attachment, Props } from "../attachment";

jest.mock("../../../../components/Text");

describe("Assessment attachment unit tests", () => {
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
        documentRevisions: []},
      },
  };
  const getWrapper = (props: Partial<Props>) => mount (
    <Formik
      onSubmit={() => {}}
      initialValues={{}}
    >
      <Field render={(fieldProps: any) => <Attachment {...fieldProps} {...defaultProps} {...props}/>} />
    </Formik>,
  );

  it("setAsyncState for FormMessage", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(FormMessage).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("setAsyncState for FormProgress", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(FormProgress).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("setAsyncState for SubmitButton", () => {
    const wrapper = getWrapper({});
    expect(wrapper.find(SubmitButton).prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("Sets Formik initialValues", () => {
    const initialValues = {
      file: undefined,
    };
    const wrapper = getWrapper({});
    expect(wrapper.find(Formik).at(1).prop("initialValues")).toEqual(initialValues);
  });
});
