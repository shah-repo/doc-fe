import { Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
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

export const ChangeRequestPreviewContainer: React.FunctionComponent<ChangeRequestPreviewContainerProps> = ({
  changeRequest,
}) => (
  <Grid container={true} spacing={2}>
    <Grid item={true} xs={2}>
      <DocumentRevisionControlPreviewPresenter
        documentsInChangeRequest={changeRequest.documentRevisions}
      />
    </Grid>
    <Grid item={true} xs={7}>
      <AssessmentPreviewPresenter changeRequest={changeRequest} />
    </Grid>
    <Grid item={true} xs={3}>
      <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />
    </Grid>
  </Grid>
);

export default connect<StateProps, {}, OwnProps, ApplicationState>(
  mapStateToProps,
)(ChangeRequestPreviewContainer);
