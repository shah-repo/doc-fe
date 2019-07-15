import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import DocumentRevisionDisplayContainer from "../../documentRevision/DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "../../documentRevision/DocumentRevisionList.container";
import { SummaryDispatchProps, SummaryOwnProps, SummaryStateProps } from "../utils/types";
import styles from "./styles";

type StateProps = SummaryStateProps;
type DispatchProps = SummaryDispatchProps;
type OwnProps = SummaryOwnProps;
type Props = OwnProps & DispatchProps & StateProps & WithStyles<typeof styles>;

const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadDocumentAsyncState(state),
  dataProp: getDocumentRevisions(state, props.documentId),
});

export const Container: React.FunctionComponent<Props> = ({
  classes,
  loadAsyncState,
  loadDocument,
  isNewVersion,
  documentId,
  documentRevisionId,
  dataProp,
}) => {
  const loadDocumentAction = () => loadDocument(documentId);

  return (
    <Grid className={classes.root} spacing={1}>
      <Grid item={true} xs={3}>
        <AsyncGate asyncState={loadAsyncState} asyncAction={loadDocumentAction} startActionOnMount={true}>
          <DocumentRevisionListContainer documentRevisions={dataProp} documentId={documentId} />
        </AsyncGate>
      </Grid>
      <Grid item={true} xs={6}>
        {documentRevisionId && <DocumentRevisionDisplayContainer documentRevisionId={documentRevisionId} isNewVersion={isNewVersion} />}
      </Grid>
      <Grid item={true} xs={3}>
        Audit
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(Container),
);
