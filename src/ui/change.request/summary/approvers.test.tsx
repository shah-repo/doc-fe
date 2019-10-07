import { mount, shallow } from "enzyme";
import React from "react";
import { Approvers,   Props } from "./approvers";
import { getApproval } from "../../../state/ducks/common/tests/factories";

describe("Approvers tests", () => {
  const defaultProps: Props = {
    dataProp: getApproval(),
    classes: {
      box: "",
    }
  };

  const getWrapper = (props: Partial<Props>) => shallow(
    <Approvers {...defaultProps} {...props}/>,
  );

  it("Approvers test", () => {
    const wrapper = getWrapper();
    console.log(wrapper.debug());
  });
});
