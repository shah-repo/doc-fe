import { Box, Button } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { DocumentRevision, documentRevisionsSelectors, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import Text from "../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../constants/urls";
import { documentNewVersionPath } from "../document.revision/utils/paths";
import documentRevisionStore from "../form.builder/stores/custom/FBDocumentRevisionStore";
import { canCreateNewVersion } from "./helpers";

interface OwnProps {
  documentRevision: DocumentRevision;
  canShowCreateVersionButton?: boolean;
}

interface StateProps {
  disableCreateNewVersion: boolean;
}

export type PreviewControlsContainerProps = OwnProps & StateProps & RouteComponentProps;

const getDisableCreateNewVersion = documentRevisionsSelectors.makeGetDisableCreateNewVersion();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  disableCreateNewVersion: getDisableCreateNewVersion(state, props.documentRevision.document.id),
});

export const PreviewControlsContainer: React.FunctionComponent<PreviewControlsContainerProps> = ({
  documentRevision, history, disableCreateNewVersion, canShowCreateVersionButton,
}) => {

    const cloneDocument = () => history.push(documentNewVersionPath(documentRevision.id, documentRevision.document.id));

    const onCreateClick = () => {
      documentRevisionStore.setMode("createFrom", documentRevision);
    };

    const renderCloneButton = () => (
      <Button color="primary" onClick={cloneDocument}>
        <Text translation="documentRevision.revise" />
      </Button>
    );

    const renderCreateFromButton = () => (
      <RouterLink
        onClick={(onCreateClick)}
        to={DOCUMENT_REVISION_CREATE_URL}
        style={{textDecoration: "none"}}
      >
        <Button color="primary">
          <Text translation="common.create.new" />
        </Button>
      </RouterLink>
    );

    const { document } = documentRevision || {};
    const { documentType } = document || {};
    const canCreate = canCreateNewVersion(documentRevision, disableCreateNewVersion, canShowCreateVersionButton);
    const canCreateFrom = (
      documentType && documentType.group === "FORM" &&
      documentRevision.status === DocumentRevisionStatus.Released
    );

    return (
      <Box component="span">
        {canCreate && renderCloneButton()}
        {canCreateFrom && renderCreateFromButton()}
      </Box>
    );
  };

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
