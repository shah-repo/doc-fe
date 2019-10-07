import { shallow } from "enzyme";
import React from "react";
import { Approvers, Props } from "./approvers";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { AsyncStatus } from "../../../state/types";
import { getApprover } from "../../../state/ducks/changeRequest/tests/factories";
import { getApproval } from "../../../state/ducks/common/tests/factories";

jest.mock("../../components/AsyncGate");

describe("Approvers tests", () => {
  const defaultProps: Props = {
    availableApprovers: getApprover(),
    dataProp: getApproval(),
  };

  const getWrapper = (props: Partial<Props>) => shallow(
    <Approvers {...defaultProps} {...props}/>,
  ).find(AutcompleteField);

  it("Sets options props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.prop("options")).toEqual(defaultProps.availableApprovers);
  });
});
