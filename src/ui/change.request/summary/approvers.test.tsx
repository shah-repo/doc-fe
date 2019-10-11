import { shallow } from "enzyme";
import React from "react";
import { getApproval } from "../../../state/ducks/common/tests/factories";
import { Approvers,   Props } from "./approvers";
import SummaryField from "../../common/summary/base";

describe("Approvers tests", () => {
  const defaultProps: Props = {
    dataProp: [getApproval()],
    classes: {
      box: "",
    },
  } as Props;

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Approvers {...defaultProps} {...props}/>,
  );

  it("Dispaly correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(SummaryField).exists()).toBe(true);
  });

});
