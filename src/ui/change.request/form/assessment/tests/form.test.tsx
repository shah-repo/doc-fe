import { mount, shallow } from "enzyme";
import { Field, Formik, FormikProps } from "formik";
import React from "react";
import { AssessmentType } from "../../../../../state/ducks/changeRequest";
import EditableSelect from "../../../../components/forms/fields/EditableSelect/EditableSelect";
import { Form, Props } from "../form";

jest.mock("../../../../components/Text");

describe("Assessment form unit test", () => {
  const getWrapper = (props: Partial<Props>) => shallow (
    <Formik
      initialValues={{assessments: {process: {}, design: {}, regulatory: {}}}}
      onSubmit={jest.fn()}
    >
      <Field render={({ form }: FormikProps) =>
        <Form form={form} type={AssessmentType.design} {...props} />} />
    </Formik>,
  );

  it("Displays form correctly", () => {
    const wrapper = getWrapper({});
    expect(wrapper.dive().dive().dive().dive().dive().find(EditableSelect)).toHaveLength(1);
  });
});
