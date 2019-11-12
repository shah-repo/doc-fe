import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getOwner } from "../../state/ducks/common/tests/factories";
import { ApprovalStatus, DocumentStatus } from "../../state/ducks/documents";
import {
  getApproval,
  getDocument,
  getUser,
} from "../../state/ducks/documents/tests/factories";
import {
  DocumentPreviewContainer,
  DocumentPreviewContainerProps,
} from "./DocumentPreview.container";
import DocumentPreviewPresenter from "./DocumentPreview.presenter";

describe("DocumentPreviewContainer tests", () => {
  const currentUserEmail = faker.internet.email();
  const document = getDocument({
    owner: getOwner({
      user: getUser({
        email: currentUserEmail,
      }),
    }),
  });
  const defaultProps: DocumentPreviewContainerProps = {
    document,
    currentUserEmail,
  };

  const getPresenter = (props: Partial<DocumentPreviewContainerProps>) =>
    shallow(<DocumentPreviewContainer {...defaultProps} {...props} />).find(
      DocumentPreviewPresenter,
    );

  it("sets document prop", () => {
    const presenter = getPresenter({});

    expect(presenter.prop("document")).toEqual(document);
  });

  it("canWithdraw", () => {
    const presenter = getPresenter({
      document: {
        ...document,
        status: DocumentStatus.InReview,
      },
    });

    expect(presenter.prop("canWithdraw")).toBe(true);
  });

  it("canSendToReview", () => {
    const presenter = getPresenter({
      document: {
        ...document,
        status: DocumentStatus.Draft,
      },
    });

    expect(presenter.prop("canSendToReview")).toBe(true);
  });

  it("canApproveOrReject", () => {
    const approverEmail = "approver@email.com";
    const presenter = getPresenter({
      document: {
        ...document,
        status: DocumentStatus.InReview,
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
