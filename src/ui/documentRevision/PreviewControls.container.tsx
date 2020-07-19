import { Box, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ReactComponent as WarningIcon } from "../../assets/images/warning.svg";
import { Document, DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { FBOutputDocumentType } from "../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { toastInfo } from "../components/notifications";
import Text from "../components/Text";
import DownloadHTML from "../document.revision/summary/download.html";
import { documentNewVersionPath } from "../document.revision/utils/paths";
import { useHandleCreateDoc } from "../documentType/list/CreateDocumentByType";
import { useReviseDocument } from "../hooks/docCustomization/useCustomization";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import { canCreateNewVersion, canCreateOutput, getIsLastVersionObsolete } from "./helpers";

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
  const handleCreateDocument = useHandleCreateDoc();
  const [showRevise, reviseLabel] = useReviseDocument(documentRevision.document?.documentType?.id);
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isEmailSent, toogleEmailSent] = useState<boolean>(false);
  const formDocumentId = documentRevision.formDocument?.document?.id || "";
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId)
  );
  const isLastVersionObsolete = () => {
    if (selectedDocument.document.documentType.group === "RECORD") {
      return;
    }
    return formDocuments && getIsLastVersionObsolete(formDocuments);
  };

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  const async = useAsync({
    onSuccess: () => {
      toogleEmailSent(true);
      toastInfo(intl.formatMessage({ id: "document.email.sent" }));
    },
  });
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevision.id));

  const cloneDocument = () => history.push(documentNewVersionPath(documentRevision.id, documentRevision.document.id));

  const cloneOutputDocument = () => {
    handleCreateDocument(documentRevision);
  };

  const canCreate = () => canCreateNewVersion(documentRevision, disableCreateNewVersion, canShowCreateVersionButton);

  const renderCloneButton = () => {
    if (hasAccess && canCreate() && showRevise) {
      return (
        <Button color="secondary" variant="outlined" onClick={cloneDocument} id="PreviewControlsContainer-revise" >
          <Text message={reviseLabel} />
        </Button>
      );
    }
  };

  const renderOutputButton = () => {
    const isAR = documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[]
    && (documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[])
      .find((type) => type.documentTypeName === "Approval Request");

    if (hasAccess && canCreateOutput(documentRevision)) {
      return (
        <Button
          color="secondary"
          variant="outlined"
          onClick={cloneOutputDocument}
          id="PreviewControlsContainer-createNew"
          data-cy="PreviewControlsContainer-createNew"
        >
          <Text translation={isAR ? "changeRequest.create" : "common.create.new"} />
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
        <div style={{ display: "flex" }}>
          <Box alignSelf="center" id="PreviewControlsContainer-warning">
            <WarningIcon style={{ marginRight: 10, width: "20px", height: "20px" }} />
            <Text translation="document.security.warning" />
          </Box>
          {!isEmailSent &&
            <Button color="secondary" variant="outlined" onClick={onSubmit} id="PreviewControlsContainer-access" >
              <Text translation="document.request.access" />
            </Button>
          }
        </div>
      );
    }
  };

  return (
    <>
      {!isLastVersionObsolete() && renderCloneButton()}
      {renderOutputButton()}
      {renderNoAccessWarning()}
      <DownloadHTML pdf={documentRevision.pdf} />
    </>
  );
};

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
