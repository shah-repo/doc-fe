import { MenuItem } from "@material-ui/core";
import { shallow } from "enzyme";
import React from "react";
import { SelectOption } from "../../forms/fields/Select";
import { TableSearchSelectField } from "./select";
import { TableSearchFieldProps } from "./types";

describe("Table search select field tests", () => {

  const options: SelectOption[] = [{
    value: 1,
    text: "One",
  }, {
    value: 2,
    text: "Two",
  }];

  type Props = Partial<TableSearchFieldProps>;

  const getWrapper = (props: Props) => shallow(
    <TableSearchSelectField key="test" selectOptions={options} {...props} />,
  );

  it("renders with 'none' as the first menu item", () => {
    const wrapper = getWrapper({});
    const items = wrapper.find(MenuItem);
    expect(items).toHaveLength(options.length + 1);
  });

  it("displays none item by default", () => {
    const wrapper = getWrapper({});
    const noneItem = wrapper.find(MenuItem).first();
    expect(noneItem.prop("value")).toEqual("");
  });

  it("displays all options", () => {
    const wrapper = getWrapper({});
    const items = wrapper.find(MenuItem);

    expect(items.at(0).prop("value")).toEqual("");
    expect(items.at(0).text()).toEqual("None");

    expect(items.at(1).prop("value")).toEqual(options[0].value);
    expect((items.at(1).find("Text")).prop("message")).toEqual(options[0].text);

    expect(items.at(2).prop("value")).toEqual(options[1].value);
    expect((items.at(2).find("Text")).prop("message")).toEqual(options[1].text);
  });
});
