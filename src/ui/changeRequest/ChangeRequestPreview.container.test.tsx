import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { ChangeRequestStatus } from "../../state/ducks/changeRequest";
import { getChangeRequest } from "../../state/ducks/changeRequest/tests/factories";
import { getApproval, getUser } from "../../state/ducks/common/tests/factories";
import { ApprovalStatus } from "../../state/ducks/common";
import {
  ChangeRequestPreviewContainer,
  ChangeRequestPreviewContainerProps,
} from "./ChangeRequestPreview.container";
import AssessmentPreviewPresenter from "./preview/AssessmentPreview.presenter";

describe("ChangeRequestPreviewContainer tests", () => {
  const currentUserEmail = faker.internet.email();
  const changeRequest = getChangeRequest({
    owner: getUser({
      email: currentUserEmail,
    }),
  });
  const defaultProps: ChangeRequestPreviewContainerProps = {
    changeRequest,
    currentUserEmail,
  };

  const getPresenter = (props: Partial<ChangeRequestPreviewContainerProps>) => shallow(
    <ChangeRequestPreviewContainer {...defaultProps} {...props} />,
  ).find(AssessmentPreviewPresenter);

  it("sets changeRequest prop", () => {
    const presenter = getPresenter({});

    expect(presenter.prop("changeRequest")).toEqual(changeRequest);
  });
});
