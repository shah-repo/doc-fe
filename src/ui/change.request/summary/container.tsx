import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { AuthProps } from "../../../state/ducks/auth/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import ChangeRequestAuditContainer from "../../changeRequest/audit/Audit.container";
import SummaryPresenter from "../../changeRequest/documentRevision/DocumentRevisionControlPreview.presenter";
import DocumentRevisionSummaryPresenter from "../../document.revision/summary/presenter";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import Presenter from "./presenter";
import styles from "./styles";

type OwnProps = DataProps<ChangeRequest>;
type StateProps = AuthProps;
type Props = OwnProps & StateProps & WithStyles<typeof styles>;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const Container: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {
  const [docRev, setDocRev] = React.useState<DocumentRevision | null>(null);

  const docRevSummary = (documentRevision: DocumentRevision) => setDocRev(documentRevision);
  const crSummary = () => setDocRev(null);

  return(
    <Grid container={true} className={classes.root} spacing={1}>
      <Grid item={true} xs={3}>
        <SummaryPresenter
          documentsInChangeRequest={dataProp.documentRevisions}
          selectAssessmentForm={crSummary}
          selectDocumentRevision={docRevSummary}
        />
      </Grid>
      <Grid item={true} xs={6}>
        {docRev && <DocumentRevisionSummaryPresenter dataProp={docRev} />}
        {!docRev && <Presenter dataProp={dataProp} />}
      </Grid>
      <Grid item={true} xs={3}>
        {docRev && <DocumentRevisionAuditContainer documentRevisionId={docRev.id} />}
        {dataProp && <ChangeRequestAuditContainer changeRequestId={dataProp.id} />}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(Container),
);
