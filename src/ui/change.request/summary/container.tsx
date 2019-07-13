import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { AuthProps } from "../../../state/ducks/auth/types";
import { ChangeRequestProps } from "../../../state/ducks/changeRequest";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import ChangeRequestAuditContainer from "../../changeRequest/audit/Audit.container";
import DocumentRevisionSummaryPresenter from "../../changeRequest/documentRevision/DocumentRevisionControlPreview.presenter";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import DocumentRevisionPreviewPresenter from "../../documentRevision/DocumentRevisionPreview.presenter";
import Presenter from "./presenter";
import styles from "./styles";

type OwnProps = ChangeRequestProps;
type StateProps = AuthProps;
type Props = OwnProps & StateProps & WithStyles<typeof styles>;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const Container: React.FunctionComponent<Props> = ({
  classes,
  changeRequest,
}) => {
  const [docRev, setDocRev] = React.useState<DocumentRevision | null>(null);

  const docRevSummary = (documentRevision: DocumentRevision) => setDocRev(documentRevision);
  const crSummary = () => setDocRev(null);

  return(
    <Grid container={true} className={classes.root} spacing={1}>
      <Grid item={true} xs={3}>
        <DocumentRevisionSummaryPresenter
          documentsInChangeRequest={changeRequest.documentRevisions}
          selectAssessmentForm={crSummary}
          selectDocumentRevision={docRevSummary}
        />
      </Grid>
      <Grid item={true} xs={6}>
        {docRev && <DocumentRevisionPreviewPresenter documentRevision={docRev} />}
        {!docRev && <Presenter changeRequest={changeRequest} />}
      </Grid>
      <Grid item={true} xs={3}>
        {docRev && <DocumentRevisionAuditContainer documentRevisionId={docRev.id} />}
        {changeRequest && <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(Container),
);
