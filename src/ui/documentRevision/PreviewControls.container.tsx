import { Box, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ReactComponent as WarningIcon } from "../../assets/images/warning.svg";
import { authSelectors } from "../../state/ducks/auth";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { Document, DocumentRevision, DocumentRevisionTransitionResponse, FBOutputDocumentType } from "../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import AlertDialog from "../app/alert.dialog/AlertDialog";
import CopyEBButton from "../components/forms/CopyEBButton";
import { toastInfo } from "../components/notifications";
import Text from "../components/Text";
import DownloadHTML from "../document.revision/summary/download.html";
import PDFSocket from "../document.revision/summary/pdf.socket";
import { documentNewVersionPath } from "../document.revision/utils/paths";
import { useHandleCreateDoc } from "../documentType/list/CreateDocumentByType";
import CustomLabelTooltip from "../hooks/docCustomization/CustomLabelTooltip";
import { useReviseDocument } from "../hooks/docCustomization/useCustomization";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDialog from "../hooks/useDialog";
import ExportToEmail from "./forms/presenters/export.to.email/ExportToEmail";
import { checkCanBeCopied, checkIsDocumentExportable, checkIsDocumentRecord, checkIsTypeHaveOutput } from "./helpers/checkDocumentGroup";
import { canCreateNewVersion, canCreateOutput } from "./helpers/documentRevisionPermissions";
import { getIsLastVersionObsolete, isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionReleased } from "./helpers/documentRevisionStatus";
import { InspectionControlsContainer } from "./InspectionControls/InspectionControls.container";

interface OwnProps {
  documentRevision: DocumentRevision;
  canShowCreateVersionButton?: boolean;
  hasAccess: boolean;
}

interface StateProps {
  disableCreateNewVersion: boolean;
}

type PreviewControlsContainerProps = OwnProps & StateProps & RouteComponentProps;

const getDisableCreateNewVersion = documentRevisionsSelectors.makeGetDisableCreateNewVersion();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  disableCreateNewVersion: getDisableCreateNewVersion(state, props.documentRevision.document.id),
});

const PreviewControlsContainer: React.FunctionComponent<PreviewControlsContainerProps> = ({
  documentRevision, history, disableCreateNewVersion, canShowCreateVersionButton, hasAccess,
}) => {
  const handleCreateDocument = useHandleCreateDoc();
  const {
    isVisible: showRevise,
    label: reviseLabel,
    tooltipConfig,
  } = useReviseDocument(documentRevision.document?.documentType?.id);
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isEmailSent, toogleEmailSent] = useState<boolean>(false);
  const formDocumentId = documentRevision.formDocument?.document?.id || "";
  const groupOptions = documentRevision.document?.documentType?.groupOptions;
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId)
  );
  const email = useSelector(authSelectors.currentUserEmail);
  const isUserDocumentOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const isRecord = checkIsDocumentRecord(groupOptions);
  const isStatusInReview = isDocumentRevisionInReview(documentRevision.status);
  const isStatusReleased = isDocumentRevisionReleased(documentRevision.status);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision.status);
  const canCopy = checkCanBeCopied(groupOptions);
  const hasOutput = checkIsTypeHaveOutput(groupOptions);

  const isLastVersionObsolete = () => {
    if (checkIsDocumentRecord(selectedDocument.document.documentType.groupOptions)) {
      return;
    }
    return formDocuments && getIsLastVersionObsolete(formDocuments);
  };

  const isExportable = () => {
    if (documentRevision.renderHTML) { return false; }
    return checkIsDocumentExportable(selectedDocument.document.documentType.groupOptions);
  };

  const isAR = documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[]
  && (documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[])
    .find((type) => type.documentTypeName === "Approval Request" || type.documentTypeName === "Change Request");

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);
  const dialog = useDialog();
  const asyncWithdraw = useAsync<DocumentRevisionTransitionResponse>();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);

  const withdrawAction = () => {
    asyncWithdraw.start(
      applyTransition,
      documentRevision.id,
      "withdrawn",
      asyncWithdraw,
    );
  };

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
    if (isAR) {
      const revisionId = documentRevision.id;
      const templateId = isAR.id;
      history.push(`/change_request/${revisionId}/create/${templateId}`);
    }
    handleCreateDocument(documentRevision);
  };

  const canCreate = () => canCreateNewVersion(documentRevision, disableCreateNewVersion, canShowCreateVersionButton);

  const renderCloneButton = () => {
    if (hasAccess && canCreate() && showRevise) {
      return (
        <CustomLabelTooltip {...{ tooltipConfig }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={cloneDocument}
            id="PreviewControlsContainer-revise"
            data-cy="updateRecord" >
            <Text message={reviseLabel} />
          </Button>
        </CustomLabelTooltip>
      );
    }
  };

  const renderOutputButton = () => {
    const isAR = documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[]
      && (documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[])
        .find((type) => type.documentTypeName === "Approval Request");

    if (hasAccess && canCreateOutput(documentRevision) && !isAR && hasOutput) {
      return (
        <Button
          color="secondary"
          variant="outlined"
          onClick={cloneOutputDocument}
          id="PreviewControlsContainer-createNew"
          data-cy="PreviewControlsContainer-createNew"
        >
          <Text translation={"common.create.new"} />
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
            <Button color="secondary" variant="outlined" onClick={onSubmit}
              id="PreviewControlsContainer-access" data-cy="PreviewControlsContainer-access" >
              <Text translation="document.request.access" />
            </Button>
          }
        </div>
      );
    }
  };

  const renderWithdrawSubmissionButton = () =>
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={dialog.open}
        data-cy="document.revision.withdraw.alert"
      >
        <Text message={"withdraw submission"} />
      </Button>
      <AlertDialog
        confirmAction={withdrawAction}
        message={"document.revision.withdraw.alert"}
        {...{ dialog }}
      />
    </>;

  return (
    <>
      {!isLastVersionObsolete() && renderCloneButton()}
      {(isStatusReleased || isStatusInDraft) && canCopy &&
        <CopyEBButton
          {...{ documentRevision }}
        />}
      {renderOutputButton()}
      {renderNoAccessWarning()}
      {isRecord && isStatusInReview && isUserDocumentOwner &&
        renderWithdrawSubmissionButton()}
      <InspectionControlsContainer {...{ documentRevision }} />
      {isExportable() && <ExportToEmail revisionId={documentRevision.id}/>}
      <DownloadHTML pdf={documentRevision.pdf} />
      <PDFSocket {...{ documentRevision }}/>
    </>
  );
};

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
