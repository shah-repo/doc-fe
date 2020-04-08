import { Box, Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ReactComponent as WarningIcon } from "../../assets/images/warning.svg";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import Text from "../components/Text";
import DownloadHTML from "../document.revision/summary/download.html";
import { documentNewVersionPath, documentOutputPath } from "../document.revision/utils/paths";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import { canCreateNewVersion, canCreateOutput } from "./helpers";
import { styles } from "./PreviewControls.styles";

interface OwnProps {
  documentRevision: DocumentRevision;
  canShowCreateVersionButton?: boolean;
  hasAccess: boolean;
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
  documentRevision, history, disableCreateNewVersion, canShowCreateVersionButton, hasAccess,
}) => {
  const classes = styles();
  const dispatch = useDispatch();

  const [isEmailSent, toogleEmailSent] = useState<boolean>(false);
  const formDocumentId = documentRevision.formDocument?.document?.id || undefined;
  const isLastVersionObsolete = useSelector((state: ApplicationState) => documentRevisionsSelectors.getIsLastVersionObsolete(state, formDocumentId));

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  const async = useAsync({
    onSuccess: () => {
      toogleEmailSent(true);
    },
  });
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevision.id));

  const cloneDocument = () => history.push(documentNewVersionPath(documentRevision.id, documentRevision.document.id));

  const cloneOutputDocument = () => {
    history.push(documentOutputPath(documentRevision.id, documentRevision.document.id));
  };

  const canCreate = () => canCreateNewVersion(documentRevision, disableCreateNewVersion, canShowCreateVersionButton);

  const renderCloneButton = () => {
    if (hasAccess && canCreate()) {
      return (
        <Button color="primary" onClick={cloneDocument} id="PreviewControlsContainer-revise" >
          <Text translation="documentRevision.revise" />
        </Button>
      );
    }
  };

  const renderOutputButton = () => {
    if (hasAccess && canCreateOutput(documentRevision)) {
      return (
        <Button color="primary" onClick={cloneOutputDocument} id="PreviewControlsContainer-createNew">
          <Text translation="common.create.new" />
        </Button>
      );
    }
  };

  const sendEmailAccessRequest = useActionCreator(documentsActions.sendEmailAccessRequest);

  const onSubmit = () => {
    async.start(
      sendEmailAccessRequest,
      documentRevision.document.id,
      {
        employee: {
          id: selectedDocument.owner.id,
        },
      },
      async);
  };

  const renderNoAccessWarning = () => {
    if (!hasAccess) {
      return (
        <div>
          <div style={{ display: "flex" }} id="PreviewControlsContainer-warning">
            <WarningIcon style={{ marginRight: 10 }} />
            <Typography variant="h6">
              <Text translation="document.security.warning" />
            </Typography>
          </div>
          {!isEmailSent &&
            <div className={classes.requestEmail}>
              <Button color="primary" onClick={onSubmit} id="PreviewControlsContainer-access" >
                <Text translation="document.request.access" />
              </Button>
            </div>}
          {isEmailSent &&
            <div className={classes.emailMessage} id="PreviewControlsContainer-emailSent">
              <Typography variant="h6">
                <Text translation="document.email.sent" />
              </Typography>
            </div>
          }
        </div>
      );
    }
  };

  return (
    <Box component="span" style={{ paddingTop: 30, width: "100%" }}>
      {!isLastVersionObsolete && renderCloneButton()}
      {renderOutputButton()}
      {renderNoAccessWarning()}
      <DownloadHTML pdf={documentRevision.pdf} />
    </Box>
  );
};

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
