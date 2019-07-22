import React from "react";
import { mount, shallow } from "enzyme";
import  { Form, Props } from "../form";
import { Formik } from "formik";
import FilledInputField from "../../../components/forms/fields/FilledInput";
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

  it("Textfield is multiline", () => {
    const wrapper = getWrapper({});
    const inputProps = { multiline: true, rows: "2" };
    expect(wrapper.dive().dive().find(FilledInputField).prop("inputProps")).toEqual(inputProps);
  })
})
