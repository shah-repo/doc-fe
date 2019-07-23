import React from "react";
import { mount, shallow } from "enzyme";
import  { Form, Props } from "../form";
import { Formik } from "formik";
import FilledSelectField from "../../../components/forms/fields/FilledSelect";
import { AssessmentType } from "../../../../state/ducks/changeRequest";

jest.mock("../../../components/Text");

describe("Assessment form unit test", () => {
  const getWrapper = (props: Partial<Props>) => shallow (
    <Formik
      initialValues={{}}
      onSubmit={jest.fn()}
    >
      <Form type={AssessmentType.design} {...props}/>
    </Formik>
  );

  it("Displays form correctly", () => {
    const wrapper = getWrapper({});
    expect(wrapper.dive().dive().find(FilledSelectField)).toHaveLength(1);
  })
})
