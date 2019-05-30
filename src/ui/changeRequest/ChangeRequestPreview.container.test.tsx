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
import ChangeRequestPreviewPresenter from "./ChangeRequestPreview.presenter";

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
  ).find(ChangeRequestPreviewPresenter);

  it("sets changeRequest prop", () => {
    const presenter = getPresenter({});

    expect(presenter.prop("changeRequest")).toEqual(changeRequest);
  });

  it("canWithdraw", () => {
    const presenter = getPresenter({
      changeRequest: {
        ...changeRequest,
        state: ChangeRequestStatus.InReview,
      },
    });

    expect(presenter.prop("canWithdraw")).toBe(true);
  });

  it("canSendToReview", () => {
    const presenter = getPresenter({
      changeRequest: {
        ...changeRequest,
        state: ChangeRequestStatus.Draft,
      },
    });

    expect(presenter.prop("canSendToReview")).toBe(true);
  });

  it("canApproveOrReject", () => {
    const approverEmail = "approver@email.com";
    const presenter = getPresenter({
      changeRequest: {
        ...changeRequest,
        state: ChangeRequestStatus.InReview,
        approvals: [
          getApproval({
            approver: getUser({ email: approverEmail }),
            status: ApprovalStatus.Pending,
          }),
        ],
      },
      currentUserEmail: approverEmail,
    });

    expect(presenter.prop("canApproveOrReject")).toBe(true);
  });
});
