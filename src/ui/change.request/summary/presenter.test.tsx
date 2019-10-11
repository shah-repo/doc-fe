import { shallow } from "enzyme";
import React from "react";
import { Presenter,   Props } from "./presenter";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import faker from "faker";
import { getChangeRequestEditRequestBody } from "../../../state/ducks/changeRequest/tests/factories";
import { getApproval } from "../../../state/ducks/common/tests/factories";
import ChangeRequestHeader from "./header";
import ApproversField from "../form/approvers";
import SubmitButton from "../../components/forms/SubmitButton";
import ControlsContainer from "../../changeRequest/forms/assessmentForm/AssessmentFormControls.container";

describe("Presenter tests", () => {
  const defaultProps: Props = {
    asyncState: ASYNC_DEFAULT_STATE ,
    canEdit: true,
    currentUserEmail: faker.internet.email(),
    closeTask: jest.fn(),
    dataProp: {...getChangeRequestEditRequestBody(), approvals: getApproval()},
    classes: {
      previewBox: "",
      submitBox: "",
      box: "",
    },
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <Presenter {...defaultProps} {...props}/>,
  );

  it("Sets props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ChangeRequestHeader).prop("dataProp")).toEqual(defaultProps.dataProp);
    expect(wrapper.find(ControlsContainer).prop("changeRequest")).toEqual(defaultProps.dataProp);
  });

  it("Displays submit button", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(SubmitButton).exists()).toBe(true);
  });

  it("Displays approvers field", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ApproversField).exists()).toBe(true);
  });

});
