import { Box, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import NewCloneEBButton from "../../../../App/Shifamed/Components/forms/presenters/CopyEBButton";
import { ReactComponent as WarningIcon } from "../../../../assets/images/warning_white.svg";
import { authSelectors } from "../../../../state/ducks/auth";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import { Document, DocumentRevision, DocumentRevisionTransitionResponse, FBOutputDocumentType } from "../../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../../state/ducks/documents";
import { ApplicationState } from "../../../../state/reducers";
import AlertDialog from "../../../../ui/app/alert.dialog/AlertDialog";
import { RequestType } from "../../../../ui/components/common/owner.changer/helpers/types";
import { toastInfo } from "../../../../ui/components/notifications";
import Text from "../../../../ui/components/Text";
import PDFSocket from "../../../../ui/document.revision/summary/pdf.socket";
import { documentNewVersionPath } from "../../../../ui/document.revision/utils/paths";
import { checkCanBeCopied, checkIsDocumentDirectApproved, checkIsDocumentExportable, checkIsDocumentRecord, checkIsTypeHaveOutput } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { canCreateNewVersion, canCreateOutput } from "../../../../ui/documentRevision/helpers/documentRevisionPermissions";
import { getIsLastVersionObsolete, isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionReleased } from "../../../../ui/documentRevision/helpers/documentRevisionStatus";
import { InspectionControlsContainer } from "../../../../ui/documentRevision/InspectionControls/InspectionControls.container";
import { useHandleCreateDoc } from "../../../../ui/documentType/list/CreateDocumentByType";
import CustomLabelTooltip from "../../../../ui/hooks/docCustomization/CustomLabelTooltip";
import { useReviseDocument } from "../../../../ui/hooks/docCustomization/useCustomization";
import useActionCreator from "../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../ui/hooks/useAsync";
import useDialog from "../../../../ui/hooks/useDialog";
import Colors from "../../../../ui/layout/theme/utils/colors";
import FormOwnerChangerContainer from "../../../Shifamed/Components/forms/presenters/change.owner/container";
import DownloadHTML from "../../../Shifamed/Components/forms/presenters/download.html";
import ExportToEmail from "../../../Shifamed/Components/forms/presenters/ExportToEmail";
import { StyledButton } from "../../../Shifamed/Components/forms/presenters/StyledListButton";
import { styles } from "./PreviewControls.styles";

interface OwnProps {
  documentRevision: DocumentRevision;
  canShowCreateVersionButton?: boolean;
  hasAccess: boolean;
  canChangeOwnerShip?: boolean;
}

interface StateProps {
  disableCreateNewVersion: boolean;
}

type PreviewControlsContainerProps = OwnProps &
StateProps &
RouteComponentProps;

const getDisableCreateNewVersion =
  documentRevisionsSelectors.makeGetDisableCreateNewVersion();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps
): StateProps => ({
  disableCreateNewVersion: getDisableCreateNewVersion(
    state,
    props.documentRevision.document.id
  ),
});

const PreviewControlsContainer: React.FunctionComponent<
  PreviewControlsContainerProps
> = ({
  documentRevision,
  history,
  disableCreateNewVersion,
  canShowCreateVersionButton,
  hasAccess,
  canChangeOwnerShip,
}) => {
  const classes = styles();
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
  const isUserDocumentOwner = documentRevision?.owner
    ? documentRevision?.owner.user.email === email
    : true;
  const isStatusInReview = isDocumentRevisionInReview(documentRevision.status);
  const isStatusReleased = isDocumentRevisionReleased(documentRevision.status);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision.status);
  const canCopy = checkCanBeCopied(groupOptions);
  const hasOutput = checkIsTypeHaveOutput(groupOptions);
  const isExportable =
    !documentRevision.renderHTML && checkIsDocumentExportable(groupOptions);
  const isDirectApproval = checkIsDocumentDirectApproved(groupOptions);
  const isLastVersionObsolete = () => {
    if (
      checkIsDocumentRecord(selectedDocument.document.documentType.groupOptions)
    ) {
      return;
    }
    return formDocuments && getIsLastVersionObsolete(formDocuments);
  };

  const isAR =
    (documentRevision.formTemplate
      ?.outputDocumentTypes as FBOutputDocumentType[]) &&
    (
      documentRevision.formTemplate
        ?.outputDocumentTypes as FBOutputDocumentType[]
    ).find(
      (type) =>
        type.documentTypeName === "Approval Request" ||
        type.documentTypeName === "Change Request"
    );

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);
  const dialog = useDialog();
  const asyncWithdraw = useAsync<DocumentRevisionTransitionResponse>();
  const applyTransition = useActionCreator(
    documentRevisionsActions.applyTransition
  );

  const withdrawAction = () => {
    asyncWithdraw.start(
      applyTransition,
      documentRevision.id,
      "withdrawn",
      asyncWithdraw
    );
  };

  const async = useAsync({
    onSuccess: () => {
      toogleEmailSent(true);
      toastInfo(intl.formatMessage({ id: "document.email.sent" }));
    },
  });
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevision.id)
  );

  const cloneDocument = () =>
    history.push(
      documentNewVersionPath(documentRevision.id, documentRevision.document.id)
    );

  const cloneOutputDocument = () => {
    if (isAR) {
      const revisionId = documentRevision.id;
      const templateId = isAR.id;
      history.push(`/change_request/${revisionId}/create/${templateId}`);
    }
    handleCreateDocument(documentRevision);
  };

  const canCreate = () =>
    canCreateNewVersion(
      documentRevision,
      disableCreateNewVersion,
      canShowCreateVersionButton
    );

  const renderCloneButton = () => {
    if (hasAccess && canCreate() && showRevise) {
      return (
        <CustomLabelTooltip {...{ tooltipConfig }}>
          <StyledButton
            color="primary"
            onClick={cloneDocument}
            id="PreviewControlsContainer-revise"
            data-cy="updateRecord"
          >
            <Text message={reviseLabel} />
          </StyledButton>
        </CustomLabelTooltip>
      );
    }
  };

  const renderOutputButton = () => {
    const isAR =
      (documentRevision.formTemplate
        ?.outputDocumentTypes as FBOutputDocumentType[]) &&
      (
        documentRevision.formTemplate
          ?.outputDocumentTypes as FBOutputDocumentType[]
      ).find((type) => type.documentTypeName === "Approval Request");

    if (hasAccess && canCreateOutput(documentRevision) && !isAR && hasOutput) {
      return (
        <StyledButton
          color="primary"
          onClick={cloneOutputDocument}
          id="PreviewControlsContainer-createNew"
          data-cy="PreviewControlsContainer-createNew"
        >
          <Text translation={"common.create.new"} />
        </StyledButton>
      );
    }
  };

  const sendEmailAccessRequest = useActionCreator(
    documentsActions.sendEmailAccessRequest
  );

  const onSubmit = () => {
    async.start(
      sendEmailAccessRequest,
      documentRevision.document.id,
      {
        employee: {
          id: selectedDocument.owner.id,
        },
      },
      async
    );
  };

  const renderNoAccessWarning = () => {
    if (!hasAccess) {
      return (
        <Box display="flex">
          <Box
            alignSelf="center"
            id="PreviewControlsContainer-warning"
            color={Colors.white}
            alignContent="center"
          >
            <Grid container alignItems="center">
              <Grid item>
                <WarningIcon
                  className={classes.warningIcon}
                />
              </Grid>
              <Grid item>
                <Text translation="document.security.warning" />
              </Grid>
            </Grid>
          </Box>
          {!isEmailSent && (
            <StyledButton
              color="primary"
              onClick={onSubmit}
              id="PreviewControlsContainer-access"
              data-cy="PreviewControlsContainer-access"
            >
              <Text translation="document.request.access" />
            </StyledButton>
          )}
        </Box>
      );
    }
  };

  const renderWithdrawSubmissionButton = () => (
    <>
      <StyledButton
        color="primary"
        onClick={dialog.open}
        data-cy="document.revision.withdraw.alert"
      >
        <Text translation="changeRequest.transition.withdrawn" />
      </StyledButton>
      <AlertDialog
        confirmAction={withdrawAction}
        message={"document.revision.withdraw.alert"}
        {...{ dialog }}
      />
    </>
  );

  return (
    <>
      {!isLastVersionObsolete() && renderCloneButton()}
      {(isStatusReleased || isStatusInDraft) && canCopy && (
        <NewCloneEBButton {...{ documentRevision }} />
      )}
      {renderOutputButton()}
      {renderNoAccessWarning()}
      {isDirectApproval &&
        isStatusInReview &&
        isUserDocumentOwner &&
        renderWithdrawSubmissionButton()}
      <InspectionControlsContainer {...{ documentRevision }} newVarient/>
      {isExportable && (
        <ExportToEmail
          revisionId={documentRevision.id}
          canAccess={documentRevision.document.canAccess}
        />
      )}
      <DownloadHTML pdf={documentRevision.pdf}/>
      {canChangeOwnerShip && (
        <FormOwnerChangerContainer
          requestId={documentRevision.id}
          requestType={RequestType.Document}
          renderAsButton={true}
        />
      )}
      <PDFSocket {...{ documentRevision }} />
    </>
  );
};

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(
  mapStateToProps
)(PreviewControlsContainerWithRouter);
