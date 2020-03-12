import { shallow } from "enzyme";
import React from "react";
import { TableSearchTextField } from "./text";
import { TableSearchFieldProps } from "./types";

describe("Table search text field tests", () => {

  type Props = Partial<TableSearchFieldProps>;

  const getWrapper = (props: Props) => shallow(
    <TableSearchTextField key="test"  {...props} />,
  );

  it("renders", () => {
    const wrapper = getWrapper({});
    expect(wrapper).toHaveLength(1);
  });

  it("input should have name prop as passed data key", () => {
    const wrapper = getWrapper({ dataKey: "testKey" });
    expect(wrapper.prop("name")).toEqual("testKey");
  });
});
