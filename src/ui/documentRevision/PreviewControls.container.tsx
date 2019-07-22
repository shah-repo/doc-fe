import { Button, Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import Text from "../components/Text";
import { documentNewVersionPath } from "../document.revision/utils/paths";
import { canCreateNewVersion, canSubmitDocumentRevision } from "./helpers";

interface OwnProps {
  documentRevision: DocumentRevision;
}

interface StateProps {
  currentUserEmail: string;
}

type PreviewControlsContainerProps = OwnProps & StateProps & RouteComponentProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const PreviewControlsContainer: React.FunctionComponent<PreviewControlsContainerProps> = ({
  documentRevision, history, currentUserEmail,
}) => {
    const cloneDocument = () => history.push(documentNewVersionPath(documentRevision.id, documentRevision.document.id));

    const renderCloneButton = () => (
      <Button color="primary" onClick={cloneDocument}>
        <Text translation="documentRevision.createNewVersion" />
      </Button>
    );

    return (
      <Grid>
        {canCreateNewVersion(documentRevision) && renderCloneButton()}
      </Grid>
    );
  };

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
