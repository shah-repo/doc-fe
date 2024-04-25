import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import { concat, filter, find, flatten, includes, sortBy, uniqBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import SM from '../../../../../App/Shifamed/Utils/SM/SM';
import { TIME_ZONE, getStartOfDayDateString } from '../../../../../common/utils/date';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Group, Permission } from '../../../../../state/ducks/auth/types';
import { changeRequestsActions } from '../../../../../state/ducks/changeRequest';
import { ChangeRequest } from '../../../../../state/ducks/changeRequest/types';
import { Owner } from '../../../../../state/ducks/common/types';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../../state/ducks/documentRevisions';
import { documentTypeActions } from '../../../../../state/ducks/documentRevisions/documentType';
import { DocumentTypeById } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus, RevisionChangeType } from '../../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../../state/reducers';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import ChangeRequestEditDialog from '../../../../change.request/dialogs/ChangeRequestEditDialog';
import { templateOptionToChangeRequestCreateBody, toChangeRequestEditRequestBody } from '../../../../change.request/form/transform';
import { ApproverPayload, InDraftAROption, TemplateOption } from '../../../../change.request/form/types';
import { changeRequestEditPath } from '../../../../change.request/utils/paths';
import Text from '../../../../components/Text';
import { FormContext } from '../../../../components/forms/FormContext';
import { Button } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import { BOMResponse } from '../../../../form.builder/FBBOM/components/treelist/interface';
import FBDataStore from '../../../../form.builder/FBStore/FBDataStore';
import { FB } from '../../../../form.builder/index';
import CustomLabelTooltip from '../../../../hooks/docCustomization/CustomLabelTooltip';
import { useApproveAndRelease } from '../../../../hooks/docCustomization/useCustomization';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { checkIsDocumentES, checkIsDocumentPO, checkIsDocumentWO } from '../../../helpers/checkDocumentGroup';
import { ApproveAndReleaseFormValues } from '../../types';
import useStyles from './ApproveAndRelease.styles';
import ApproveAndReleaseForm from './ApproveAndReleaseForm';
import ObsoleteRelatedEQDialog from './ObsoleteRelatedEQDialog';
import SelectionForm from './SelectionForm';
import SplitReleaseButton, { ARActions } from './SplitReleaseButton';

interface Props {
  id?: string
  status?: DocumentRevisionStatus
  isQms: boolean
  needsSignature: boolean
  documentName: string
  docRevId: string
  owner?: Owner
  documentTypeId?: string
  revisionStage?: number
  isRecord: boolean
  isInlineApproval: boolean
  renderAsButton?: boolean
  isBOMExists?: boolean
  isPart?: boolean
  isSliderView?: boolean
  inDialog?: boolean
}

const OBSOLETE_RELATED_EQ_KEY = 'fb-is-obsolete-related-eq';

const ApproveAndRelease: React.FunctionComponent<Props> = ({
  id,
  status,
  isQms,
  needsSignature,
  documentName,
  docRevId,
  owner,
  documentTypeId,
  revisionStage,
  isRecord,
  isInlineApproval,
  renderAsButton,
  isBOMExists = false,
  isPart = false,
  isSliderView,
  inDialog,
}) => {
  // MARK: @selectors
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));

  const documentRevision = useSelector(
    (state: ApplicationState) => documentRevisionsSelectors.getDocumentRevision(state, docRevId),
  );

  // MARK: @state
  const [documentTypeGroups, setDocTypeGroups] = useState<Group[]>([]);
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [inDraftAROptions, setInDraftAROptions] = useState<InDraftAROption[]>([]);
  const [formDocument, setFormDocument] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [selectedInvalid, setSelectedInvalid] = useState<boolean>(false);
  const [checkedGroups, setCheckedGroups] = useState<Group[]>([]);
  const [changeRequestId, setChangeRequestId] = useState<string>('');
  const [optionChosen, setOptionChosen] = useState<string>();
  const [isObsoleteRelatedEQAnswered, setIsObsoleteRelatedEQAnswered] = useState<boolean>(false);

  // MARK: @config
  const isNewLayout = SM.isNewLayout;
  const history = useHistory();
  const docId = documentRevision?.document?.docId || '';
  const title = documentRevision?.name;
  const isDocumentPO = checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions);
  const isWO = checkIsDocumentWO(documentRevision?.document?.documentType?.groupOptions);
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useApproveAndRelease(documentTypeId);
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();

  const expressApprovalDialog = useDialog();
  const templateSelectionDialog = useDialog();
  const existingDraftARSelectionDialog = useDialog();
  const obsoleteRelatedEQDialog = useDialog();
  const approvalRequestDialog = useDialog();

  const alertDialog = useDialog();

  const dispatch = useDispatch();

  const transformedDocTypeGroups = ([] as Group[]).concat(...documentTypeGroups);
  const initialValues = {
    password: '',
    effectiveDate: '',
    approvals: [],
    formDocument: { id: '' },
    documentType: { id: '' },
  };
  let initialGroups: Group[] = [];
  const showApprovers = !isQms ? needsSignature : isQms;

  // MARK: @actions
  const releaseAction = useActionCreator(documentRevisionsActions.approveAndRelease);
  const finalizeAction = useActionCreator(documentRevisionsActions.finalizeAndRelease);
  const releaseNonQmsAction = useActionCreator(documentRevisionsActions.approveAndReleaseNonQms);
  const create = useActionCreator(changeRequestsActions.create);
  const getGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);

  // MARK: @async
  const async = useAsync({ onSuccess: expressApprovalDialog.close });
  const asyncGroups = useAsync({
    onSuccess: (response: Group[] = []) => {
      setDocTypeGroups([
        response,
      ].flat());
      if (isDocumentPO) {
        const ownerGroup = find(
          sortBy(uniqBy(response, 'id'), 'documentStage'),
          (group) => includes(group.joinedEmployees.map((e) => e.id), owner?.id),
        );
        if (ownerGroup) {
          initialGroups = [{
            ...ownerGroup,
            groupApprover: owner?.id,
          }];
        }
      } else {
        initialGroups = filter(
          uniqBy(response, 'id'),
          (group) => includes(group.joinedEmployees.map((e) => e.id), owner?.id),
        );
      }
      setCheckedGroups(initialGroups);
    },
  });

  // Templates Call
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
  const asyncGetDocTypeByGroup = useAsync({
    onSuccess: (data: DocumentTypeById[] = []) => {
      const options = flatten(
        data.map((template) =>
          template.forms.map((form) => ({
            label: form.name,
            value: form.id,
            docTypeId: template.documentType.id,
            schema: form.formTemplate?.schema,
            formInput: form.formInput,
          })),
        ),
      );
      setTemplateOptions(options);
      if (!optionChosen) {
        templateSelectionDialog.close();
      }
    },
  });

  // Existing Draft CO calls
  const getDraftApprovalRequestsAction = useActionCreator(changeRequestsActions.draftApprovalRequestsList);
  const asyncGetDraftApprovalRequests = useAsync({
    onSuccess: (data: Array<Pick<ChangeRequest, 'crId' | 'title' | 'id'>> = []) => {
      const options = data.map((option) => ({
        label: `${option.crId} - ${option.title}`,
        value: option.id,
        crId: option.crId,
      }));
      if (options.length === 0) {
        toastError('No Approval Requests in Draft');
        return;
      }
      setInDraftAROptions(options);
    },
  });

  const createCRAction = useActionCreator(changeRequestsActions.create);
  const createCRAsync = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      if (createdChangeRequest) {
        setChangeRequestId(createdChangeRequest.id);
        templateSelectionDialog.close();
        approvalRequestDialog.open();
      }
    },
    onError: (err) => {
      toastError(err as string);
    },
  });

  const [isBomRecord, setIsBomRecord] = useState<boolean>(isBOMExists);
  const bomInfoAsync = useAsync({
    onSuccess: (response?: BOMResponse) => {
      setIsBomRecord((response?.bomTreeRelations ?? [])?.length > 0);
    },
  });

  const fetchBOMTreeList = useActionCreator(
    documentRevisionsActions.fetchBOMTree,
  );

  useEffect(() => {
    if (isBomRecord || !isPart) {
      return;
    }
    setIsBomRecord(isBOMExists);
    bomInfoAsync.start(
      fetchBOMTreeList,
      documentRevision.id,
      isWO,
      bomInfoAsync,
    );
  }, []);

  useEffect(() => {
    if (isObsoleteRelatedEQAnswered) {
      openDialog(optionChosen as ARActions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObsoleteRelatedEQAnswered]);

  useEffect(() => {
    if (templateOptions.length === 1 && optionChosen === ARActions.NEW) {
      templateSelectionDialog.close();
      processCreatingRevision(templateOptions[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateOptions]);

  useEffect(() => {
    if (inDraftAROptions.length === 1) {
      existingDraftARSelectionDialog.close();
      processChosenApprovalRequest(inDraftAROptions[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inDraftAROptions]);

  const processCreatingRevision = (templateChosen?: TemplateOption) => {
    if (!templateChosen) {
      return;
    }
    const data = templateOptionToChangeRequestCreateBody(templateChosen);
    createCRAsync.start(createCRAction, data, createCRAsync);
  };

  const processChosenApprovalRequest = (approvalRequestChosen?: InDraftAROption) => {
    if (!approvalRequestChosen) {
      return;
    }

    setChangeRequestId(approvalRequestChosen.value);

    existingDraftARSelectionDialog.close();
    approvalRequestDialog.open();
  };

  const asyncAR = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      createdChangeRequest && history.push(changeRequestEditPath(createdChangeRequest.id));
    },
  });

  // MARK: @helpers
  const initialValuesAR = (values: any): any => ({
    title: intl.formatMessage({ id: 'documentRevision.releasing' }, { docId, title }),
    description: intl.formatMessage({ id: 'documentRevision.releasing' }, { docId, title }),
    documentType: { id: documentType },
    formDocument: {
      id: values.formDocument.value,
    },
    formInput: {
      approvers: values.approvals
        .map((approval) => approval.value)
        .concat(owner?.id).filter((id) => id)
        .map((id) => ({ approver: { id } })),
      documentRevisions: [{
        descriptionOfChange: intl.formatMessage({ id: 'common.numeric.release' }),
        id: FB.uniqid,
        justificationOfChange: intl.formatMessage({ id: 'common.numeric.release' }),
        proposedDocumentRevision: { id: docRevId },
      }],
      effectiveDate: values.effectiveDate,
      password: values.password,
    },
  });

  const renderForm = (props: FormikProps<ApproveAndReleaseFormValues>) => (
    <ApproveAndReleaseForm
      {...props}
      asyncState={selectedInvalid ? asyncAR.asyncState : async.asyncState}
      cancel={closeDialog}
      documentTypeGroups={transformedDocTypeGroups}
      owner={owner as Owner}
      {...{
        isQms,
        needsSignature,
        templateOptions,
        setFormDocument,
        setDocumentType,
        closeDialog,
        setSelectedInvalid,
        selectedInvalid,
        isRecord,
        isInlineApproval,
        isDocumentPO,
        checkedGroups,
        setCheckedGroups,
        initialGroups,
      }}
      asyncGetDocTypeState={asyncGetDocTypeByGroup.asyncState}
    />
  );

  // MARK: @methods
  const openDialog = (option?: ARActions) => {
    async.reset();
    setOptionChosen(option);

    if (
      !isObsoleteRelatedEQAnswered
      && checkIsDocumentES(documentRevision?.document?.documentType?.groupOptions)
      && documentRevision?.revisionChangeType === RevisionChangeType.Obsolete
      && documentRevision?.schema?.find(item => item.name === OBSOLETE_RELATED_EQ_KEY)
    ) {
      obsoleteRelatedEQDialog.open();
      return;
    }

    setIsObsoleteRelatedEQAnswered(false);

    if (!option && docRevId) {
      expressApprovalDialog.open();

      if (showApprovers) {
        asyncGroups.start(
          getGroupsByStage,
          docRevId,
          asyncGroups,
        );
      }

      asyncGetDocTypeByGroup.start(
        getDocTypeByGroupAction,
        { docTypeGroupOption: 'CHANGE_REQUEST' },
        asyncGetDocTypeByGroup,
      );
    } else if (option === ARActions.NEW) {
      templateSelectionDialog.open();

      asyncGetDocTypeByGroup.start(
        getDocTypeByGroupAction,
        { docTypeGroupOption: 'CHANGE_REQUEST' },
        asyncGetDocTypeByGroup,
      );
    } else if (option === ARActions.EXISTING) {
      existingDraftARSelectionDialog.open();

      asyncGetDraftApprovalRequests.start(
        getDraftApprovalRequestsAction,
        asyncGetDraftApprovalRequests,
      );
    }
  };

  const closeDialog = () => {
    setFormDocument('');
    setDocumentType('');
    setSelectedInvalid(false);
    expressApprovalDialog.close();
  };

  const closeCRDialog = () => {
    approvalRequestDialog.close();
    if (inDialog) {
      FBDataStore.newlyCreatedDocInfo = { ...FBDataStore.newlyCreatedDocInfo, reRender: true };
      return;
    }

    if (isSliderView) {
      FBDataStore.selectedSliderInfo = { documentId: documentRevision.document.id, documentRevision: documentRevision, reRender: true };
    } else {
      dispatch(documentRevisionsActions.load(docRevId));
    }
  };

  const getApproverPayload = (approverId?: string): ApproverPayload => ({
    approver: { id: approverId ?? null },
    signatureGroupId: { id: find(checkedGroups, (group) => group.groupApprover === approverId)?.id ?? null },
  });

  const onSubmit = (values: any) => {
    if (selectedInvalid) {
      asyncAR.start(create, toChangeRequestEditRequestBody(initialValuesAR(values)), asyncAR);
      return;
    }

    /** Add owner to approvals (needed for validation) */
    const approvalsBody = concat(values.approvals || [], [{ value: owner?.id }]);

    const approversWithSignatures = !values.approvals || values.approvals.length === 0
      ? [getApproverPayload(owner?.id)]
      : approvalsBody.map((approver) => (getApproverPayload(approver.value)));
    const effectiveDate = values.effectiveDate !== ''
      ? values.effectiveDate
      : undefined;
    const password = values.password !== ''
      ? values.password
      : undefined;

    if (!isQms) {
      async.start(
        releaseNonQmsAction,
        id,
        {
          approversWithSignatures,
          effectiveDate,
          documentType: { id: documentType },
          formDocument: { id: formDocument },
        },
        password,
        async,
      );
      return;
    }
    if (isRecord) {
      async.start(
        finalizeAction,
        id,
        {
          effectiveDate: getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString()),
        },
        async,
      );
      return;
    }
    async.start(
      releaseAction,
      id,
      {
        approversWithSignatures,
        effectiveDate,
        documentType: { id: documentType },
        formDocument: { id: formDocument },
      },
      password,
      isSliderView,
      inDialog,
      async,
    );
  };

  // MARK: @render
  if (!isVisible || !id || status !== DocumentRevisionStatus.Draft || !canApprove) {
    return null;
  }

  const handleObsoletingESAnswer = (shouldObsolete: boolean) => {
    const oldValues = formState?.getValues() ?? {};
    oldValues[OBSOLETE_RELATED_EQ_KEY] = shouldObsolete;
    workspaceState?.saveDocRev(oldValues);
    setIsObsoleteRelatedEQAnswered(true);
  };

  return (
    <>
      <CustomLabelTooltip {...{ tooltipConfig }}>
        {isNewLayout && !isRecord ? (
          renderAsButton
            ? (
              <SplitReleaseButton
                className={classes.button}
                disableExpessAR={isBomRecord || isBOMExists || revisionStage !== 1}
                onClick={openDialog}
              />
            )
            : (
              <StyledMenuListItem button alignItems="flex-start">
                <StyledMenuListItemText
                  id="ApproveAndRelease-button"
                  data-cy="ApproveAndRelease-button"
                  primary={<Text message={label} />}
                  onClick={() => openDialog()}
                />
              </StyledMenuListItem>
            )
        ) : (
          <Button
            kind="white"
            className={classes.button}
            onClick={() => isRecord ? alertDialog.open() : openDialog()}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
          >
            <Text message={isRecord ? 'record.finalize.and.release' : label} />
          </Button>
        )}
      </CustomLabelTooltip>
      {
        expressApprovalDialog.isOpen
        && <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          maxWidth="xs"
          open={expressApprovalDialog.isOpen}
          onSubmit={(event: React.FormEvent) => event.stopPropagation()}
          classes={{ paper: classes.dialogPaper }}
          id="ApproveAndRelease-dialog"
        >
          <DialogTitle className={classes.dialogTitle} disableTypography>
            {isQms
              && <Text translation={isRecord ? 'record.finalize.and.release' : 'common.approve.and.release'} />
            }
            {!isQms && <Text translation="common.warning.message" values={{ name: documentName }} />}
          </DialogTitle>
          <DialogContent
            classes={{ root: classes.dialogContent }}
            id="ApproveAndRelease-content"
          >
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
              >
                {renderForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      }
      <SelectionForm
        title="page.title.changeRequestCreate"
        loading={asyncGetDocTypeByGroup.isLoading || createCRAsync.isLoading}
        handler={templateSelectionDialog}
        options={templateOptions}
        confirmLabel="common.create"
        onConfirm={(option: TemplateOption) => processCreatingRevision(option)}
      />
      <SelectionForm
        title="page.title.changeRequestOpen"
        loading={asyncGetDraftApprovalRequests.isLoading}
        handler={existingDraftARSelectionDialog}
        options={inDraftAROptions}
        confirmLabel="common.open"
        onConfirm={(option: InDraftAROption) => processChosenApprovalRequest(option)}
      />
      {obsoleteRelatedEQDialog.isOpen && (
        <ObsoleteRelatedEQDialog
          documentRevision={documentRevision}
          handler={obsoleteRelatedEQDialog}
          onAnswer={handleObsoletingESAnswer}
        />
      )}
      {approvalRequestDialog.isOpen && (
        <ChangeRequestEditDialog
          changeRequestId={changeRequestId}
          approvalRequestDialog={approvalRequestDialog}
          closeDialog={closeCRDialog}
          currentDocRevId={docRevId}
        />
      )}
      <AlertDialog
        message="record.release.alert"
        dialog={alertDialog}
        confirmAction={onSubmit}
      />
    </>
  );
};

export default ApproveAndRelease;
