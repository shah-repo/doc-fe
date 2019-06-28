import React from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest, ChangeRequestStatus } from "../../state/ducks/changeRequest";
import { Approval, ApprovalStatus } from "../../state/ducks/common";
import { ApplicationState } from "../../state/reducers";
import AssessmentPreviewPresenter from "./preview/AssessmentPreview.presenter";
import DocumentRevisionControlPreviewPresenter from "./documentRevision/DocumentRevisionControlPreview.presenter";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import DocumentRevisionPreviewPresenter from "../documentRevision/DocumentRevisionPreview.presenter";
import { canSubmitDocumentRevision } from "../documentRevision/helpers";

interface StateProps {
  currentUserEmail: string;
}

interface OwnProps {
  changeRequest: ChangeRequest;
}

export type ChangeRequestPreviewContainerProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const ChangeRequestPreviewContainer: React.FunctionComponent<ChangeRequestPreviewContainerProps> = ({
  changeRequest,
  currentUserEmail,
}) => {
  const [selectedDocumentRevision, setSelectedDocumentRevision] = React.useState<DocumentRevision | null>(null);

  const isCurrentUserOwner = changeRequest.owner.email === currentUserEmail;
  const canWithdraw = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;

  const currentUserApproval = changeRequest.approvals.find((approval) => approval.approver.email === currentUserEmail);
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject =
    isCurrentUserApprover &&
    changeRequest.state === ChangeRequestStatus.InReview &&
    (currentUserApproval as Approval).status === ApprovalStatus.Pending;


  const canSubmitDocument = selectedDocumentRevision && canSubmitDocumentRevision(selectedDocumentRevision, currentUserEmail);

  const renderAssessmentPreview = () => (
    <AssessmentPreviewPresenter
      canSendToReview={canSendToReview}
      canWithdraw={canWithdraw}
      canApproveOrReject={canApproveOrReject}
      changeRequest={changeRequest}
    />
  );
  const renderDocumentRevision = () => (
    <DocumentRevisionPreviewPresenter documentRevision={selectedDocumentRevision} />
  );

  const selectDocumentRevision = (documentRevision: DocumentRevision) => setSelectedDocumentRevision(documentRevision)
  const selectAssessmentForm = () => setSelectedDocumentRevision(null);

  return (
    <Grid container={true} spacing={8}>
      <Grid item={true} xs={2}>
        <DocumentRevisionControlPreviewPresenter
          documentsInChangeRequest={changeRequest.documentRevisions}
          selectAssessmentForm={selectAssessmentForm}
          selectDocumentRevision={selectDocumentRevision}
        />
      </Grid>
      <Grid item={true} xs={10}>
        {!selectedDocumentRevision && renderAssessmentPreview()}
        {selectedDocumentRevision && renderDocumentRevision()}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(ChangeRequestPreviewContainer);
