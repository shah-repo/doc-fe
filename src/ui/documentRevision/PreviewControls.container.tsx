import { Button, Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DocumentRevision, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import Text from "../components/Text";
import { documentNewVersionPath } from "../document.revision/utils/paths";
import { canCreateNewVersion } from "./helpers";

interface OwnProps {
  documentRevision: DocumentRevision;
  canShowCreateVersionButton?: boolean;
}

interface StateProps {
  disableCreateNewVersion: boolean;
}

type PreviewControlsContainerProps = OwnProps & StateProps & RouteComponentProps;

const getDisableCreateNewVersion = documentRevisionsSelectors.makeGetDisableCreateNewVersion();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  disableCreateNewVersion: getDisableCreateNewVersion(state, props.documentRevision.document.id),
});

export const PreviewControlsContainer: React.FunctionComponent<PreviewControlsContainerProps> = ({
  documentRevision, history, disableCreateNewVersion, canShowCreateVersionButton
}) => {
    const cloneDocument = () => history.push(documentNewVersionPath(documentRevision.id, documentRevision.document.id));

    const renderCloneButton = () => (
      <Button color="primary" onClick={cloneDocument}>
        <Text translation="documentRevision.revise" />
      </Button>
    );

    return (
      <Grid>
        {canCreateNewVersion(documentRevision, disableCreateNewVersion, canShowCreateVersionButton) && renderCloneButton()}
      </Grid>
    );
  };

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
