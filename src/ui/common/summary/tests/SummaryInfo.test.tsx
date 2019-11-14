import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import Text from "../../../components/Text";
import { Props, SummaryInfo } from "../SummaryInfo";

describe("SummaryInfo tests", () => {
  const defaultProps: Props = {
    label: "translation.unknown",
    value: faker.random.word(),
  };

  const getWrapper = (props: Partial<Props> = {}) =>
    shallow(<SummaryInfo {...defaultProps} {...props} />);

  it("Renders correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(Text).prop("translation")).toEqual(defaultProps.label);
    expect(wrapper.contains(defaultProps.value)).toBe(true);
  });
});
