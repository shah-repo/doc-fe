import { mount, ReactWrapper } from "enzyme";
import { Form, Formik } from "formik";
import { get } from "lodash";
import React from "react";
import SelectField, { SelectOption, SelectOwnProps } from "./Select";

jest.mock("@material-ui/core/Select", () => (props: any) => (
  <select>
    {props.children}
  </select>
));
jest.mock("@material-ui/core/MenuItem", () => (props: any) => (
  <option value={props.value}>
    {props.children}
  </option>
));

describe("Select component tests", () => {
  const options: SelectOption[] = [{
    value: "1",
    text: "Test value 1",
  }, {
    value: "2",
    text: "Test value 2",
  }];

  const getWrapper = (props: Partial<SelectOwnProps>): ReactWrapper => {
    const renderForm = () => (
      <Form>
        <SelectField name="test" options={options} {...props} />
      </Form>
    );

    return mount(
      <Formik
        initialValues={{ test: "" }}
        onSubmit={jest.fn()}
      >
        {renderForm}
      </Formik>,
    );
  };

  it("displays empty item by default", () => {
    const wrapper = getWrapper({});
    const emptyItem = wrapper.find("option").first();

    expect(emptyItem.prop("value")).toEqual("");
  });

  it("does not display empty item", () => {
    const wrapper = getWrapper({ includeEmpty: false });
    const emptyItem = wrapper.find("option").first();

    expect(emptyItem.prop("value")).not.toEqual("");
  });

  it("displays all options", () => {
    const wrapper = getWrapper({ includeEmpty: false });
    const optionsNodes = wrapper.find("option");

    expect(optionsNodes.at(0).prop("value")).toEqual(options[0].value);
    expect(get(optionsNodes.at(0).props(), "children.props.message")).toEqual(options[0].text);

    expect(optionsNodes.at(1).prop("value")).toEqual(options[1].value);
    expect(get(optionsNodes.at(1).props(), "children.props.message")).toEqual(options[1].text);
  });
});
