import { shallow } from "enzyme";
import React from "react";
import { getApproval } from "../../../state/ducks/common/tests/factories";
import { Approvers,   Props } from "./approvers";

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

  it("Approvers test", () => {
    const wrapper = getWrapper();
    console.log(wrapper.debug());
  });
});
