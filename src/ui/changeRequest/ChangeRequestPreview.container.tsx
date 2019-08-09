import { Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import {
  ChangeRequest,
  ChangeRequestStatus,
} from "../../state/ducks/changeRequest";
import { Approval, ApprovalStatus } from "../../state/ducks/common";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import DocumentRevisionAuditContainer from "../documentRevision/audit/Audit.container";
import ChangeRequestAuditContainer from "./audit/Audit.container";
import DocumentRevisionControlPreviewPresenter from "./documentRevision/DocumentRevisionControlPreview.presenter";
import AssessmentPreviewPresenter from "./preview/AssessmentPreview.presenter";

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

export const ChangeRequestPreviewContainer: React.FunctionComponent<
  ChangeRequestPreviewContainerProps
> = ({ changeRequest }) => {
  const [
    selectedDocumentRevision,
    setSelectedDocumentRevision,
  ] = React.useState<DocumentRevision | null>(null);

  const renderAssessmentPreview = () => (
    <AssessmentPreviewPresenter changeRequest={changeRequest} />
  );
  const renderDocumentRevision = () => (
    <DocumentRevisionSummaryPresenter dataProp={selectedDocumentRevision!} />
  );

  const renderChangeRequestAudit = () => {
    if (changeRequest) {
      return <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />;
    }
  };

  const renderDocumentRevisionAudit = () => {
    if (selectedDocumentRevision) {
      return (
        <DocumentRevisionAuditContainer
          documentRevisionId={selectedDocumentRevision.id}
        />
      );
    }
  };

  const selectDocumentRevision = (documentRevision: DocumentRevision) =>
    setSelectedDocumentRevision(documentRevision);
  const selectAssessmentForm = () => setSelectedDocumentRevision(null);

  return (
    <Grid container={true} spacing={2}>
      <Grid item={true} xs={2}>
        <DocumentRevisionControlPreviewPresenter
          documentsInChangeRequest={changeRequest.documentRevisions}
          selectAssessmentForm={selectAssessmentForm}
          selectDocumentRevision={selectDocumentRevision}
          selectedDocumentRevision={selectedDocumentRevision!.id || null}
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

export default connect<StateProps, {}, OwnProps, ApplicationState>(
  mapStateToProps,
)(ChangeRequestPreviewContainer);
