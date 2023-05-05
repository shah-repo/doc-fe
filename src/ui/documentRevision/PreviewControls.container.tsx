import { Box, Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StyledButton } from '../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as WarningIcon } from '../../assets/images/warning.svg';
import { ReactComponent as WarningWhiteIcon } from '../../assets/images/warning_white.svg';
import { ReactComponent as WithDrawSubmissionIcon } from '../../assets/images/withdraw_submission.svg';
import { getPOIndexDbInstance } from '../../indexDb';
import { authSelectors } from '../../state/ducks/auth';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../state/ducks/documentRevisions';
import { Document, DocumentRevision, DocumentRevisionTransitionResponse, FBOutputDocumentType, POStatusType } from '../../state/ducks/documentRevisions/types';
import { documentsActions } from '../../state/ducks/documents';
import { ApplicationState } from '../../state/reducers';
import AlertDialog from '../app/alert.dialog/AlertDialog';
import HeaderPOStatus from '../components/common/header/HeaderPOStatus';
import HeaderPOStatusOptions from '../components/common/header/HeaderPOStatusOptions';
import HeaderMenu from '../components/common/header/Menu';
import OwnerChangerContainer from '../components/common/owner.changer/container';
import { RequestType } from '../components/common/owner.changer/helpers/types';
import ClonePOButton from '../components/forms/ClonePOButton';
import CopyEBButton from '../components/forms/CopyEBButton';
import { toastInfo } from '../components/notifications';
import Text from '../components/Text';
import DownloadHTML from '../document.revision/summary/download.html';
import PDFSocket from '../document.revision/summary/pdf.socket';
import { documentNewVersionPath } from '../document.revision/utils/paths';
import { useHandleCreateDoc } from '../documentType/list/CreateDocumentByType';
import CustomLabelTooltip from '../hooks/docCustomization/CustomLabelTooltip';
import { useReviseDocument, useUpdateDocument } from '../hooks/docCustomization/useCustomization';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import useDialog from '../hooks/useDialog';
import Colors from '../layout/theme/utils/colors';
import ExportToEmail from './forms/presenters/export.to.email/ExportToEmail';
import GenerateHtmlPreview from './forms/presenters/GenerateHtmlPreview';
import { checkCanBeCopied, checkCanTypeCreateInspection, checkIsDocumentDirectApproved, checkIsDocumentEB, checkIsDocumentExportable, checkIsDocumentPO, checkIsDocumentRecord, checkIsTypeHaveOutput } from './helpers/checkDocumentGroup';
import { canCreateNewVersion, canCreateOutput } from './helpers/documentRevisionPermissions';
import { getIsLastVersionObsolete, isDocumentRevisionApproved, isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionObsolete, isDocumentRevisionReleased, isDocumentRevisionVoided } from './helpers/documentRevisionStatus';
import { InspectionControlsContainer } from './InspectionControls/InspectionControls.container';
import { PreviewControlButtons } from './PreviewControls.container.types';

interface OwnProps {
  documentRevision: DocumentRevision
  canShowCreateVersionButton?: boolean
  hasAccess: boolean
  canChangeOwnerShip: boolean
}

interface StateProps {
  disableCreateNewVersion: boolean
}

type PreviewControlsContainerProps = OwnProps & StateProps & RouteComponentProps;

const getDisableCreateNewVersion = documentRevisionsSelectors.makeGetDisableCreateNewVersion();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  disableCreateNewVersion: getDisableCreateNewVersion(state, props.documentRevision.document.id),
});

const PreviewControlsContainer: React.FunctionComponent<PreviewControlsContainerProps> = ({
  documentRevision, history, disableCreateNewVersion, canShowCreateVersionButton, hasAccess, canChangeOwnerShip,
}) => {
  const isNewLayout = SM.isNewLayout;
  const handleCreateDocument = useHandleCreateDoc();
  const {
    isVisible: showRevise,
    label: reviseLabel,
    tooltipConfig,
  } = useReviseDocument(documentRevision.document?.documentType?.id);
  const {
    isVisible: showUpdate,
    label: updateLabel,
    tooltipConfig: updateRecordtooltipConfig,
  } = useUpdateDocument(documentRevision.document?.documentType?.id);

  const intl = useIntl();
  const dispatch = useDispatch();
  const [isEmailSent, toogleEmailSent] = useState<boolean>(false);

  const formDocumentId = documentRevision.formDocument?.document?.id || '';
  const groupOptions = documentRevision.document?.documentType?.groupOptions;
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId),
  );
  const email = useSelector(authSelectors.currentUserEmail);
  const isUserDocumentOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const isStatusInReview = isDocumentRevisionInReview(documentRevision.status);
  const isStatusReleased = isDocumentRevisionReleased(documentRevision.status);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision.status);
  const canCopy = checkCanBeCopied(groupOptions);
  const isPO = checkIsDocumentPO(groupOptions);
  const isEB = checkIsDocumentEB(groupOptions);
  const hasOutput = checkIsTypeHaveOutput(groupOptions);
  const isExportable = !documentRevision.renderHTML && checkIsDocumentExportable(groupOptions);
  const isDirectApproval = checkIsDocumentDirectApproved(groupOptions);
  const isLastVersionObsolete = () => {
    if (checkIsDocumentRecord(selectedDocument.document.documentType.groupOptions)) {
      return;
    }
    return formDocuments && getIsLastVersionObsolete(formDocuments);
  };

  const isAR = documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[]
  && (documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[])
    .find((type) => type.documentTypeName === 'Approval Request' || type.documentTypeName === 'Change Request');

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
      'withdrawn',
      asyncWithdraw,
    );
  };

  const async = useAsync({
    onSuccess: () => {
      toogleEmailSent(true);
      toastInfo(intl.formatMessage({ id: 'document.email.sent' }));
    },
  });
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevision.id));

  const clonePODocument = () => {
    try {
      getPOIndexDbInstance().put({
        description: documentRevision.description,
        formInput: documentRevision.formInput,
      });
    } catch (e) {}
    cloneDocument();
  };

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

  const renderCloneButton = (renderAsButton) => {
    if (hasAccess && canCreate() && showRevise) {
      return (
        <CustomLabelTooltip {...{ tooltipConfig }}>
          {isNewLayout ? (
            renderAsButton ? <StyledButton
              color="primary"
              onClick={cloneDocument}
              id="PreviewControlsContainer-revise"
              data-cy="updateRecord"
            >
              <Text message={reviseLabel} />
            </StyledButton>
              : <StyledMenuListItem button alignItems="flex-start" onClick={cloneDocument}>
                <StyledMenuListIcon><WithDrawSubmissionIcon /></StyledMenuListIcon>
                <StyledMenuListItemText
                  id="PreviewControlsContainer-revise"
                  data-cy="updateRecord"
                  primary={<Text message={reviseLabel} />}
                />
              </StyledMenuListItem>
          ) : (
            <Button
              color="secondary"
              variant="outlined"
              onClick={cloneDocument}
              id="PreviewControlsContainer-revise"
              data-cy="updateRecord" >
              <Text message={reviseLabel} />
            </Button>
          )}
        </CustomLabelTooltip>
      );
    }
  };
  const renderUpdateButton = (renderAsButton) => {
    if (hasAccess && canCreate() && showUpdate) {
      return (
        <CustomLabelTooltip {...{ tooltipConfig: updateRecordtooltipConfig }}>
          {isNewLayout ? (
            renderAsButton ? (
              <StyledButton
                color="primary"
                onClick={clonePODocument}
                id="PreviewControlsContainer-revise"
                data-cy="updateRecord"
              >
                <Text message={updateLabel} />
              </StyledButton>
            ) : (
              <StyledMenuListItem button alignItems="flex-start" onClick={clonePODocument}>
                <StyledMenuListIcon>
                  <WithDrawSubmissionIcon />
                </StyledMenuListIcon>
                <StyledMenuListItemText
                  id="PreviewControlsContainer-revise"
                  data-cy="updateRecord"
                  primary={<Text message={updateLabel} />}

                />
              </StyledMenuListItem>
            )
          ) : (
            <Button
              color="secondary"
              variant="outlined"
              onClick={cloneDocument}
              id="PreviewControlsContainer-revise"
              data-cy="updateRecord"
            >
              <Text message={updateLabel} />
            </Button>
          )}
        </CustomLabelTooltip>
      );
    }
  };

  const renderOutputButton = (renderAsButton) => {
    const isAR = documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[]
      && (documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[])
        .find((type) => type.documentTypeName === 'Approval Request'
        || type.documentTypeName === 'Document Change Order');

    if (hasAccess && canCreateOutput(documentRevision) && !isAR && hasOutput) {
      return isNewLayout ? (
        renderAsButton ? <StyledButton
          color="primary"
          onClick={cloneOutputDocument}
          id="PreviewControlsContainer-createNew"
          data-cy="PreviewControlsContainer-createNew"
        >
          <Text translation="common.create.new" />
        </StyledButton> : <StyledMenuListItem button alignItems="flex-start" onClick={cloneOutputDocument}>
          <StyledMenuListItemText
            id="PreviewControlsContainer-createNew"
            data-cy="PreviewControlsContainer-createNew"
            primary={<Text translation="common.create.new" />}

          />
        </StyledMenuListItem>
      ) : (
        <Button
          color="secondary"
          variant="outlined"
          onClick={cloneOutputDocument}
          id="PreviewControlsContainer-createNew"
          data-cy="PreviewControlsContainer-createNew"
        >
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
        <div style={{ display: 'flex' }}>
          <Box alignSelf="center" id="PreviewControlsContainer-warning">
            <WarningIcon style={{ marginRight: 10, width: '20px', height: '20px' }} />
            <Text translation="document.security.warning" />
          </Box>
        </div>
      );
    }
  };

  const newRenderNoAccessWarning = () => {
    if (!hasAccess) {
      return (
        <Box display="flex">
          <Box alignSelf="center" id="PreviewControlsContainer-warning" color={Colors.white} alignContent="center" >
            <Grid container alignItems="center">
              <Grid item>
                <WarningWhiteIcon style={{ marginRight: 10, width: '20px', height: '20px' }} />
              </Grid>
              <Grid item>
                <Text translation="document.security.warning" />
              </Grid>
            </Grid>
          </Box>
        </Box>
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
        <Text message="withdraw submission" />
      </Button>
      <AlertDialog
        confirmAction={withdrawAction}
        message="document.revision.withdraw.alert"
        {...{ dialog }}
      />
    </>;

  const newRenderWithdrawSubmissionButton = (renderAsButton: boolean) => (<>
    {renderAsButton ? <StyledButton
      color="primary"
      onClick={dialog.open}
      data-cy="document.revision.withdraw.alert"
    >
      <Text translation="changeRequest.transition.withdrawn" />
    </StyledButton> : <StyledMenuListItem button alignItems="flex-start" onClick={dialog.open}>
      <StyledMenuListIcon><WithDrawSubmissionIcon /></StyledMenuListIcon>
      <StyledMenuListItemText
        data-cy="document.revision.withdraw.alert"
        primary={<Text translation="changeRequest.transition.withdrawn" />}
      />
    </StyledMenuListItem>}
    <AlertDialog
      confirmAction={withdrawAction}
      message="document.revision.withdraw.alert"
      {...{ dialog }}
    />
  </>);

  const requestAccessSentButton = (renderAsButton) => !hasAccess && !isEmailSent && (
    renderAsButton ? <StyledButton
      color="primary"
      onClick={onSubmit}
      id="PreviewControlsContainer-access"
      data-cy="PreviewControlsContainer-access"
    >
      <Text translation="document.request.access" />
    </StyledButton> : <StyledMenuListItem button alignItems="flex-start" onClick={onSubmit}>
      <StyledMenuListItemText
        id="PreviewControlsContainer-access"
        data-cy="PreviewControlsContainer-access"
        primary={<Text translation="document.request.access" />}
      />
    </StyledMenuListItem>
  );

  const accessableButtons: PreviewControlButtons[] = [];
  if (!isLastVersionObsolete() && hasAccess && canCreate() && !isPO && showRevise) {
    accessableButtons.push(PreviewControlButtons.CloneButton);
  }
  if (!isLastVersionObsolete() && hasAccess && canCreate() && isPO && showUpdate
   && POStatusType.CLOSED !== selectedDocument.poStatus) {
    accessableButtons.push(PreviewControlButtons.UpdateButton);
  }
  if ((isStatusReleased || isStatusInDraft) && canCopy && isEB) {
    accessableButtons.push(PreviewControlButtons.NewCloneEB);
  }

  if ((isStatusReleased || isStatusInDraft || isStatusInReview) && canCopy && isPO) {
    accessableButtons.push(PreviewControlButtons.NewClonePO);
  }
  if (hasAccess && canCreateOutput(documentRevision) && !isAR && hasOutput) {
    accessableButtons.push(PreviewControlButtons.OutputButton);
  }
  if (!isEmailSent && !hasAccess) {
    accessableButtons.push(PreviewControlButtons.RequestAccess);
  }
  if (isDirectApproval && isStatusInReview && isUserDocumentOwner) {
    accessableButtons.push(PreviewControlButtons.WithdrawSubmission);
  }

  const docRevGroupOptions = documentRevision.document?.documentType?.groupOptions;
  const canCreateInspection = checkCanTypeCreateInspection(docRevGroupOptions);
  const isDocumentDraft = isDocumentRevisionInDraft(documentRevision.status);
  const isDocumentInReview = isDocumentRevisionInReview(documentRevision.status);
  const isDocumentApproved = isDocumentRevisionApproved(documentRevision.status);
  const isDocumentReleased = isDocumentRevisionReleased(documentRevision.status);
  const isDocumentVoided = isDocumentRevisionVoided(documentRevision.status);
  const isDocumentObsolete = isDocumentRevisionObsolete(documentRevision.status);
  const isRenderHTMLDefined = documentRevision.formDocument?.renderHTMLDefined;

  if ((isStatusInDraft || isStatusInReview) && isPO && isRenderHTMLDefined) {
    accessableButtons.push(PreviewControlButtons.GeneratePDF);
  }
  if (!(!isDocumentDraft || !canCreateInspection)) {
    accessableButtons.push(PreviewControlButtons.InspectionControl);
  }
  if (documentRevision.pdf) {
    accessableButtons.push(PreviewControlButtons.Pdf);
  }
  if (canChangeOwnerShip) {
    accessableButtons.push(PreviewControlButtons.ChangeOwner);
  }
  if (isExportable) {
    accessableButtons.push(PreviewControlButtons.ExportToEmail);
  }

  let initialButtons: string[] = [];
  let restButtons: string[] = [];

  function ownerOrEmail (ele: PreviewControlButtons) {
    if ([PreviewControlButtons.ChangeOwner,
      PreviewControlButtons.ExportToEmail,
      PreviewControlButtons.NewCloneEB,
      PreviewControlButtons.NewClonePO,
      PreviewControlButtons.InspectionControl,
      PreviewControlButtons.Pdf,
      PreviewControlButtons.GeneratePDF].includes(ele)) {
      return ele;
    }
  }
  if (accessableButtons.length >= 1) {
    const elementsList = [PreviewControlButtons.ChangeOwner,
      PreviewControlButtons.ExportToEmail,
      PreviewControlButtons.NewCloneEB,
      PreviewControlButtons.NewClonePO,
      PreviewControlButtons.InspectionControl,
      PreviewControlButtons.GeneratePDF];
    const initialFilteredButtons = accessableButtons.filter((ele) => !elementsList.includes(ele));
    const restFilteredButtons = accessableButtons.filter((ownerOrEmail));
    initialButtons = initialFilteredButtons.length >= 2 ? initialFilteredButtons.slice(0, 2) : initialFilteredButtons;
    restButtons = initialFilteredButtons.length >= 2 ? initialFilteredButtons.slice(2) : [];
    restButtons = [...restButtons, ...restFilteredButtons];
  }

  const renderbuttons = (buttons: string[], renderAsButton: boolean) => (
    <>
      {buttons.includes(PreviewControlButtons.CloneButton) && renderCloneButton(renderAsButton)}
      {buttons.includes(PreviewControlButtons.UpdateButton) && renderUpdateButton(renderAsButton)}
      {buttons.includes(PreviewControlButtons.NewCloneEB) && (
        <CopyEBButton {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.NewClonePO) && (
        <ClonePOButton {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.OutputButton) && renderOutputButton(renderAsButton)}
      {buttons.includes(PreviewControlButtons.RequestAccess) && requestAccessSentButton(renderAsButton)}
      {buttons.includes(PreviewControlButtons.WithdrawSubmission) && !isNewLayout
        && renderWithdrawSubmissionButton()}
      {buttons.includes(PreviewControlButtons.WithdrawSubmission) && isNewLayout
        && newRenderWithdrawSubmissionButton(renderAsButton)}
      {buttons.includes(PreviewControlButtons.InspectionControl) && (
        <InspectionControlsContainer {...{ documentRevision }} renderAsButton={renderAsButton} />
      )}
      {buttons.includes(PreviewControlButtons.Pdf)
      && <DownloadHTML pdf={documentRevision.pdf} renderAsButton={renderAsButton} isPO={isPO} docRevId={documentRevision?.id} />}
      {buttons.includes(PreviewControlButtons.GeneratePDF) && (
        <GenerateHtmlPreview
          id={documentRevision.id}
          renderHTMLDefined={documentRevision.formDocument?.renderHTMLDefined}
          showDownloadButton={false}
        />
      )}
      {buttons.includes(PreviewControlButtons.ChangeOwner) && (
        <OwnerChangerContainer
          requestId={documentRevision.id}
          requestType={RequestType.Document}
          renderAsButton={renderAsButton}
        />
      )}
      {buttons.includes(PreviewControlButtons.ExportToEmail) && (
        <ExportToEmail
          revisionId={documentRevision.id}
          canAccess={documentRevision.document.canAccess}
          renderAsButton={renderAsButton}
        />
      )}
    </>
  );
  return (
    <>
      <PDFSocket {...{ documentRevision }} />
      {isNewLayout ? newRenderNoAccessWarning() : renderNoAccessWarning()}
      <>
        {isPO
          && documentRevision.poStatus
          && (isDocumentInReview || isDocumentDraft || isDocumentVoided || isDocumentObsolete) && (
          <HeaderPOStatus poStatus={documentRevision.poStatus} />
        )}
      </>
      <>
        {hasAccess && canCreate() && isPO
          && documentRevision?.id
          && documentRevision?.poStatus
          && (isDocumentApproved || isDocumentReleased) && (
          <HeaderPOStatusOptions
            poStatus={documentRevision?.poStatus}
            docId={documentRevision?.id}
            docRevOwner= {documentRevision?.owner?.user?.name}
            updatedAt= {documentRevision?.updatedAt || ''}
            isOwner = {isUserDocumentOwner}
          />
        )}
      </>
      {initialButtons.length > 0 && renderbuttons(initialButtons, true)}
      {restButtons.length > 0 && (
        <HeaderMenu>{renderbuttons(restButtons, false)}</HeaderMenu>
      )}
    </>
  );
};

const PreviewControlsContainerWithRouter = withRouter(PreviewControlsContainer);

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PreviewControlsContainerWithRouter);
