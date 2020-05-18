import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getChangeRequestEditRequestBody } from "../../../state/ducks/changeRequest/tests/factories";
import { getApproval } from "../../../state/ducks/common/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import ApproversField from "../form/approvers";
import { Presenter, Props } from "./presenter";
import SummaryHeader from "./SummaryHeader";

describe("Presenter tests", () => {
  const defaultProps: Props = {
    asyncState: ASYNC_DEFAULT_STATE,
    canEdit: true,
    currentUserEmail: faker.internet.email(),
    closeTask: jest.fn(),
    canChangeOwnerShip: true,
    errors: { [faker.lorem.word()]: faker.lorem.word() },
    dataProp: { ...getChangeRequestEditRequestBody(), approvals: getApproval() },
    classes: {
      previewBox: "",
      submitBox: "",
      box: "",
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Presenter {...defaultProps} {...props}/>,
  );

  it("Sets SummaryHeader props correctly", () => {
    const summaryHeaderProps = {
      dataProp: defaultProps.dataProp,
      canChangeOwnerShip: defaultProps.canChangeOwnerShip,
      asyncState: defaultProps.asyncState,
      errors: defaultProps.errors,
      canEdit: defaultProps.canEdit,
    };
    const wrapper = getWrapper();
    expect(wrapper.find(SummaryHeader).props()).toEqual(summaryHeaderProps);
  });

  it("Displays approvers field", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ApproversField).exists()).toBe(true);
  });
});

