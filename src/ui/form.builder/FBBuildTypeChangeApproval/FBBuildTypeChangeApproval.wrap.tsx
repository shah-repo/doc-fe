import { Box } from '@material-ui/core';
import { compact, difference, filter, find, findIndex, get, isEmpty, isUndefined, map, union, unionBy, uniq, without } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FB, FBApprovalPasswordForm, FBApprover, FBDialogState, FBInlineApprovalBody, FBInlineApprovalTransition, FBRequiredApprover } from '..';
import { SM } from '../../../App';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { Approval } from '../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { ApprovalStatus, DocumentStatus } from '../../../state/ducks/documents/types';
import { store } from '../../../state/store';
import { DocTypeGroups } from '../../dashboard.new/line.items/common/types';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { checkIsDocumentReceivable, checkIsDocumentWO } from '../../documentRevision/helpers/checkDocumentGroup';
import { isDocumentAlphaReleased } from '../../documentRevision/helpers/revisionStage';
import { generateLHRsDocs } from '../FBLHRStep/utils';
import FBStore from '../FBStore/FBStore';
import FBBuildTypeChangeApprovalState from './FBBuildTypeChangeApproval.state';
import { FBBuildTypeChangeApprovalProps } from './FBBuildTypeChangeApproval.types';

export const withFBBuildTypeChangeApproval = <T extends FBBuildTypeChangeApprovalProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onApproveClick,
    approvals,
    name = '',
    loading,
    disabled,
    documentStatus,
    disabledOptions,
    disableChipDelete,
    docId,
    approvalTransition,
    groups,
    renderOption,
    isIncluded,
    isContributorIncluded,
    currentUser,
    ownerId,
    dialogState,
    showFieldOwnersWarning,
    owners,
    approvalApprovedGroup,
    selectedValue,
    prevValue,
    submitRef,
    validateRef,
    skipExistingApprovals,
    ...props
  }: T) => {
    let isComponentVisible = false;
    let inlineApprovalExists = false;
    const history = useHistory();
    const { _documentRevisionFormState } = SM.useStores();
    const { workspaceState, formState } = FB.useStores();
    const {
      document,
      changeRequest,
      id,
      externalState: { company: { companyMine: { employees = [] } = {} } = {} } = {},
    } = workspaceState || {};
    const {
      inputOwners = [],
    } = document || {};
    const ownerIds = uniq(Object.values(inputOwners as unknown as string));
    owners = employees.filter((e) => ownerIds.includes(e.id)).map((owner) => ({
      name: `${owner?.user?.name} (${owner?.user?.email})`,
      id: owner.id,
    }));
    const isReceivable = checkIsDocumentReceivable(document?.document?.documentType?.groupOptions);
    const isWO = checkIsDocumentWO(document?.document?.documentType?.groupOptions);

    const {
      owner: { user: { id: userId = '' } = {} } = {},
    } = document || changeRequest || {};
    const isAlphaReleased = isDocumentAlphaReleased(document?.revisionStage);

    disabled = disabled || isUndefined(id) || loading;
    if (document?.status === DocumentRevisionStatus.InReview
      || changeRequest?.state === ChangeRequestStatus.InReview) {
      disabled = false;
    }
    if (document?.status === DocumentRevisionStatus.Released) {
      disabled = true;
    }

    const dispatch = useDispatch();
    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;
    currentUser = authUser.id;
    let docApprovals = document?.approvals || changeRequest?.approvals;
    if (!docApprovals?.length && FBStore.selectedApprover.length) {
      docApprovals = FBStore.selectedApprover;
    }
    const approvalsState = FB.useRef(
      FBBuildTypeChangeApprovalState,
      { approvals: skipExistingApprovals ? [] : docApprovals, isOwner, fromBuildType: prevValue?.id || '', toBuildType: selectedValue?.id || '' },
    );
    dialogState = FB.useRef(FBDialogState);

    const stagedApproverIds = React.useRef<string[]>([]);
    const stagedRemovedIds = React.useRef<string[]>([]);

    approvalTransition = (transition: FBInlineApprovalTransition, approvalId?: string, password?: string) => {
      if (!approvalId) { return; }
      approvalsState?.applyTransition(transition, approvalId, { password });
    };

    function includesApprover (group: FBRequiredApprover, approver: string): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    React.useEffect(() => {
      const fieldValue = map(approvalsState?.getApprovals, 'approver.id');
      formState?.setFieldValue(`fb-approvals-${name}`, fieldValue, false);

      const activeApprovals = filter(docApprovals, (a) => a.status !== 'ABANDONED');
      if (isWO && authUser && document?.status === DocumentRevisionStatus.Draft
        && document && !document?.formTemplate
        && !activeApprovals?.length) {
        // Add Default owner as approver on Work order case
        addApprover([authUser?.employeeId]);
        formState?.setFieldValue(`fb-approvals-${name}`, [authUser?.employeeId], false);
      }

      formState?.inputState.get(`fb-approvals-${name}`)?.setRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: 'form.builder.password.prompt',
        open: true,
        content: <FBApprovalPasswordForm {...{ approvalId, approvalTransition }} />,
      });
    };

    // On add approver
    React.useEffect(() => reaction(
      () => approvalsState?.approvalApi.data,
      (data) => {
        if (!data) { return; }
        document?.approvals?.push(data as Approval);
        FBStore.selectedApprover.push(data as Approval);
        concatApprovals(data);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On transition
    React.useEffect(() => reaction(
      () => approvalsState?.transitionApi.data,
      (data) => {
        if (
          isReceivable
          && data?.poDocId && data?.poDocRevision
        ) {
          localStorage.setItem('reOpenedPOInfo', JSON.stringify({ id: data?.poDocId, revId: data?.poDocRevision }));
        }
        concatApprovals(data);
        if (data?.status === DocumentStatus.Draft) {
          window.location.reload();
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function concatApprovals (approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      if (approval.status === ApprovalStatus.Approved
        && (document?.document.documentType.documentTypeName === 'LHR Step' || document?.document.documentType.group === DocTypeGroups.PI_INSTANCE)) {
        const values = generateLHRsDocs(_documentRevisionFormState?.documentRevision);
        history.push(documentVersionPath(values?.docRevId ?? '', values?.documentId ?? ''), { toTabId: 'details' });
      }
      if (
        approval.status
        && [ApprovalStatus.Rejected, ApprovalStatus.Approved].includes(
          approval.status as ApprovalStatus,
        )
      ) {
        window.location.reload();
      } else {
        const stateApprovals = filter(
          approvalsState?.approvals,
          (a) => a.approver?.id !== approval.approver?.id,
        );
        approvalsState?.setApprovals(unionBy(stateApprovals, [approval], 'id'));
      }
    }

    React.useEffect(() => reaction(
      () => formState?.newValues.get(`fb-approvals-${name}`),
      (fieldValue: string[]) => {
        if (workspaceState?.isPreview) {
          return;
        }
        const formValue: string[] = get(formState?.oldValues, `fb-approvals-${name}`);
        const addedIds = difference(fieldValue, formValue);
        const removedIds = difference(formValue, fieldValue);
        // Stage newly selected approvers; do not make API calls yet
        stagedApproverIds.current = [
          ...without(stagedApproverIds.current, ...removedIds),
          ...addedIds,
        ];
        // Stage removals of committed approvals — don't call API until Update is clicked
        const committedRemovedIds = removedIds.filter(removedId =>
          approvalsState?.getApprovals.some(a => a.approver?.id === removedId),
        );
        stagedRemovedIds.current = [
          ...stagedRemovedIds.current.filter(id => !addedIds.includes(id)),
          ...committedRemovedIds.filter(id => !stagedRemovedIds.current.includes(id)),
        ];
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Register submit function so parent's confirm button triggers approval creation
    React.useEffect(() => {
      if (submitRef) {
        submitRef.current = () => {
          addApprover(stagedApproverIds.current);
          removeApprover(stagedRemovedIds.current);
          stagedApproverIds.current = [];
          stagedRemovedIds.current = [];
        };
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function addApprover (ids?: string[]) {
      if (!id) { return; }
      map(ids, (approver) => approvalsState?.addApproval({
        assigned: { id: approver },
        type: 'SECTION',
        fieldId: name,
        partOf: { id },
      }, () => {
        const { id } = workspaceState || {};
        if (!id) { return; }
        dispatch(documentRevisionsActions.loadAudit(id));
        if (!workspaceState?.autosave) { return; }
        workspaceState?.saveDocRev(formState?.getValues());
      }));
    }

    function removeApprover (ids?: string[]) {
      if (!ids) { return; }
      map(ids, (approver) => {
        const deletedApproverIndex = findIndex(document?.approvals, (a) =>
          a.approverId === approver && a.status === ChangeRequestStatus.Draft as string);
        const approval = find(approvalsState?.getApprovals, (a) => a.approver?.id === approver);
        document?.approvals?.splice(deletedApproverIndex, 1);
        const SelApprover = findIndex(FBStore.selectedApprover, (a) =>
          a.approverId === approver && a.status === ChangeRequestStatus.Draft as string);
        FBStore.selectedApprover?.splice(SelApprover, 1);

        if (document?.approvals?.[deletedApproverIndex]) {
          document.approvals[deletedApproverIndex].status = ApprovalStatus.Abandoned;
        }
        approvalsState?.applyTransition('abandon', (approval as FBInlineApprovalBody)?.id, undefined, () => {
          const id = workspaceState?.id;
          if (id) { dispatch(documentRevisionsActions.loadAudit(id)); }
          if (!workspaceState?.autosave) { return; }
          workspaceState?.saveDocRev(formState?.getValues());
        });
      });
    }

    isIncluded = (group: FBRequiredApprover): boolean =>
      (group.joinedEmployees as string[]).some((employee) =>
        approvals?.map((approval) => approval.approver?.id).includes(employee));

    isContributorIncluded = (id: string): boolean => {
      const values = formState?.inputState.get('fb-approvals-' + name)?.value;
      return values?.includes(id);
    };
    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string []
        = compact(map(groups, (group) => includesApprover(group, option.id) ? group.name : ''));
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <Box fontWeight="fontWeightMedium">{option.user?.name}</Box>
          &nbsp;({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box>
              &nbsp;{`- ${requiredGroups.join(', ')}`}
            </Box>
          )}
        </Box>
      );
    };

    // MARK: @observer
    useObserver(() => {
      inlineApprovalExists = Boolean(_documentRevisionFormState?.documentRevision?.formDocument?.formTemplate?.schema
        .some((e) => (!e.deleted && e.type === 'inlineapproval' as string)));

      groups = approvalsState?.groups;
      approvals = approvalsState?.getApprovals;

      const isRevisionAfterA = document?.revisionStage !== 1
        && (document?.revision !== 1 || document?.subRevision !== 0);

      isComponentVisible = document?.status !== DocumentRevisionStatus.Voided
        && (!inlineApprovalExists || isRevisionAfterA);

      loading = (
        approvalsState.loading
        || approvalsState?.approvalApi.loading
        || approvalsState?.transitionApi.loading
      );

      if (isWO && authUser && document?.status === DocumentRevisionStatus.Draft
        && document && !document?.formTemplate) {
        disabledOptions = [authUser?.employeeId];
        disableChipDelete = true;
      }

      const currentSelectedIds: string[] = formState?.newValues.get(`fb-approvals-${name}`) || [];
      isIncluded = (group: FBRequiredApprover): boolean =>
        (group.joinedEmployees as string[]).some((employee) => currentSelectedIds.includes(employee));
    });

    // TODO: check what is going on with the types,
    // had to add any, DocumentStatus and DocumentRevisionStatus are not the same
    documentStatus = document?.status as any;

    showFieldOwnersWarning = document?.document
      .documentType
      .groupOptions?.includes(DOC_TYPE_GROUP_OPTION.INPUT_OWNERS_APPROVERS)
     && !isEmpty(owners) && documentStatus !== DocumentStatus.Released;

    if (!isComponentVisible) {
      return null;
    }

    const approvedStates = [
      DocumentRevisionStatus.Released,
      DocumentRevisionStatus.Approved,
      DocumentRevisionStatus.Deprecated,
    ];
    const isApproved = documentStatus && approvedStates.includes(documentStatus as unknown as DocumentRevisionStatus);

    if (isApproved) {
      if (approvals?.length) {
        approvalApprovedGroup = approvals.reduce((list: string[], approval) => {
          if (approval.status !== ApprovalStatus.Approved) {
            return list;
          }
          return union(list, approval.approverGroups);
        }, []) as unknown as string[];
      } else {
        groups = {};
      }
    }

    // Register validation function so parent can validate before confirming
    React.useEffect(() => {
      if (validateRef) {
        validateRef.current = () => {
          const currentSelectedIds: string[] = formState?.newValues.get(`fb-approvals-${name}`) || [];

          if (currentSelectedIds.length === 0) {
            return { type: 'no_approvers' };
          }

          const currentGroups = approvalsState?.groups;
          if (currentGroups && Object.keys(currentGroups).length > 0) {
            const unsatisfiedGroups = Object.values(currentGroups).filter(group =>
              !(group.joinedEmployees as string[]).some(employee => currentSelectedIds.includes(employee)),
            );
            if (unsatisfiedGroups.length > 0) {
              return { type: 'group_required', groupNames: unsatisfiedGroups.map(g => g.name) };
            }
          }

          return null;
        };
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      dialogState,
      approvals,
      name,
      loading,
      disabled,
      documentStatus,
      docId: id,
      approvalTransition,
      groups,
      renderOption,
      isIncluded,
      currentUser,
      ownerId,
      inlineApprovalExists,
      onApproveClick,
      isAlphaReleased,
      owners,
      disabledOptions,
      disableChipDelete,
      showFieldOwnersWarning,
      isContributorIncluded,
      approvalApprovedGroup,
      selectedValue,
      prevValue,
    });
  };

  Comp.displayName = 'withFBBuildTypeChangeApproval';
  return Comp;
};
