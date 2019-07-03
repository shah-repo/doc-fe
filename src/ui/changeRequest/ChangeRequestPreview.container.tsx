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
import ChangeRequestAuditContainer from './audit/Audit.container';
import DocumentRevisionAuditContainer from '../documentRevision/audit/Audit.container';

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

  const renderAssessmentPreview = () => (
    <AssessmentPreviewPresenter changeRequest={changeRequest} />
  );
  const renderDocumentRevision = () => (
    <DocumentRevisionPreviewPresenter documentRevision={selectedDocumentRevision} />
  );

  const renderChangeRequestAudit = () => {
    if (changeRequest) {
      return <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />
    }
  }

  const renderDocumentRevisionAudit = () => {
    if (selectedDocumentRevision) {
      return <DocumentRevisionAuditContainer documentRevisionId={selectedDocumentRevision.id} />
    }
  }

  const selectDocumentRevision = (documentRevision: DocumentRevision) => setSelectedDocumentRevision(documentRevision)
  const selectAssessmentForm = () => setSelectedDocumentRevision(null);

  return (
    <Grid container={true} spacing={2}>
      <Grid item={true} xs={2}>
        <DocumentRevisionControlPreviewPresenter
          documentsInChangeRequest={changeRequest.documentRevisions}
          selectAssessmentForm={selectAssessmentForm}
          selectDocumentRevision={selectDocumentRevision}
        />
      </Grid>
      <Grid item={true} xs={7}>
        {!selectedDocumentRevision && renderAssessmentPreview()}
        {selectedDocumentRevision && renderDocumentRevision()}
      </Grid>
      <Grid item={true} xs={3}>
        {renderDocumentRevisionAudit()}
        {renderChangeRequestAudit()}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(ChangeRequestPreviewContainer);
