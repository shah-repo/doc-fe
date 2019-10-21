import { shallow } from "enzyme";
import React from "react";
import { Approvers, Props } from "./approvers";
import faker from "faker";
import { getApproval } from "../../../state/ducks/common/tests/factories";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";

describe("Approvers tests", () => {
  const defaultProps: Props = {
    availableApprovers: [{
      label: faker.name.firstName(),
      value: faker.internet.email(),
    }],
    dataProp: [getApproval()],
    loadApproversAsyncState: ASYNC_DEFAULT_STATE,
    loadAvailableApprovers: jest.fn(),
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <Approvers {...defaultProps} {...props}/>,
  ).find(AutcompleteField);

  it("Sets options prop correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.prop("options")).toEqual(defaultProps.availableApprovers);
  });
});
