import { Grid, Button } from "@material-ui/core";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import React from "react";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import Text from "../components/Text";
import { canSubmitDocumentRevision, canCreateNewVersion } from "./helpers";
import PendingSubmissionDialogContainer from "./dialogs/PendingSubmissionDialog.container";
import { documentNewVersionPath } from "../document.revision/utils/paths";
import { ApplicationState } from "../../state/reducers";
import { authSelectors } from "../../state/ducks/auth";
import { connect } from "react-redux";


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
  documentRevision, history, currentUserEmail
}) => {
    const cloneDocument = () => history.push(documentNewVersionPath(documentRevision.id, documentRevision.document.id));

    const renderPendingSubmissionButton = () => {
      if (canSubmitDocumentRevision(documentRevision, currentUserEmail)) {
        return (
          <PendingSubmissionDialogContainer
            transition="pending_submission"
            documentRevisionId={documentRevision.id}
          />
        );
      }
    }

    const renderCloneButton = () => {
      if (canCreateNewVersion(documentRevision)) {
        return (
          <Button color="primary" onClick={cloneDocument}>
            <Text translation="documentRevision.createNewVersion" />
          </Button>
        )
      }
    }

    return (
      <Grid>
        {renderPendingSubmissionButton()}
        {renderCloneButton()}
      </Grid>
    );
  };

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
