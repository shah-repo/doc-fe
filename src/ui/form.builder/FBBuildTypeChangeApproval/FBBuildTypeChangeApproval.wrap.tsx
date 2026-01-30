import { difference, filter, find, isEmpty, isUndefined, map, pick, some, sortBy, unionBy } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FB, FBApprovalPasswordForm, FBAutocompleteAsyncOption, FBDialogState, FBEmployee } from '..';
import { ApprovalStatus } from '../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { store } from '../../../state/store';
import { FBDataStoreApprovalKeys } from '../../documentRevision/forms/types';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import FBDataStore from '../FBStore/FBDataStore';
import FBBuildTypeChangeApprovalState from './FBBuildTypeChangeApproval.state';
import { FBBuildTypeChangeApprovalBody, FBBuildTypeChangeApprovalOptions, FBBuildTypeChangeApprovalProps, FBBuildTypeChangeApprovalTransition, FBRequestApprovalTransitionBody } from './FBBuildTypeChangeApproval.types';

export const withFBBuildTypeChangeApproval = <T extends FBBuildTypeChangeApprovalProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    approvalTransition,
    buildTypeChangeApprovalState,
    dialogState,
    editorConfig: { approvers, groups, roles } = {},
    currentUser,
    isApproved,
    isPreview,
    approvals,
    disabled,
    options,
    name = '',
    loading,
    onApproveClick,
    ...props
  }: T) => {
    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const dispatch = useDispatch();
    dialogState = FB.useRef(FBDialogState);
    const {
      id,
      document,
      changeRequest,
      isOutput,
      document: { version: docVersion = 1 } = {},
    } = workspaceState || {};
    const docApprovals = FBDataStore?.refreshData?.approvals || document?.approvals || changeRequest?.approvals;
    const userId = (
      document?.owner?.user?.id
      || changeRequest?.owner?.user?.id
    );

    isPreview = workspaceState?.mode === 'preview';
    const fieldApprovals = useMemo(
      () => docApprovals?.filter((approval) => approval.fieldId === name && approval.status !== ApprovalStatus.Abandoned) ?? [],
      [docApprovals, name],
    );

    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;
    currentUser = authUser.id;
    buildTypeChangeApprovalState = FB.useRef(FBBuildTypeChangeApprovalState, {
      approvals: fieldApprovals,
      isOwner,
    });

    const shouldShowRequestAllApprovals = isOwner && !isEmpty(buildTypeChangeApprovalState.getApprovals);
    dialogState = FB.useRef(FBDialogState);
    const shouldShowApprovals = document?.status === 'DRAFT' || document?.status === 'IN_REVIEW';

    onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: 'form.builder.password.prompt',
        open: true,
        content: (
          <FBApprovalPasswordForm
            {...{ approvalTransition, approvalId }}
          />
        ),
      });
    };

    // MARK: @reaction
    // Approvals sync
    React.useEffect(() => reaction(
      () => workspaceState?.approvals,
      (data) => {
        if (!difference(buildTypeChangeApprovalState?.approvals, data || [])) {
          return;
        }
        const fieldApprovals = filter(data, { fieldId: name });
        buildTypeChangeApprovalState?.setApprovals(fieldApprovals);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On transition
    React.useEffect(() => reaction(
      () => buildTypeChangeApprovalState?.transitionApi.data,
      (data) => {
        concatApprovals(data);
        FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.BUILD_TYPE_CHANGE_APPROVALS);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // On requestApprovalTransition
    React.useEffect(() => reaction(
      () => buildTypeChangeApprovalState?.requestApprovalApi.data,
      (data) => {
        concatApprovals(data);
        FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.BUILD_TYPE_CHANGE_APPROVALS);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Form sync
    React.useEffect(() => reaction(
      () => formState?.inputState.get('fb-btca-' + name)?.value,
      (fieldValue: string[]) => {
        const formValue: string[] = map(buildTypeChangeApprovalState?.getApprovals, 'approver.id');
        addApprover(difference(fieldValue, formValue));
        removeApprover(difference(formValue, fieldValue));
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Init
    const fieldValue = map(buildTypeChangeApprovalState?.getApprovals, 'approver.id');
    formState?.setFieldValue(`fb-btca-${name}`, fieldValue);

    // On add approver
    React.useEffect(() => reaction(
      () => buildTypeChangeApprovalState?.approvalApi.data,
      (data) => {
        concatApprovals(data);
        FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.BUILD_TYPE_CHANGE_APPROVALS);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Approvers list
    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.availableApprovers),
      (data) => {
        if (!data) { return; }
        const value = Array.from(map(approvers as string[], (i) => data.get(i)));
        concatOptions(value, 'Approvers');
      }, {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    // Groups list
    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.groups),
      (data) => {
        if (!data) { return; }
        map(groups as string[], (groupName: string) => {
          const group = data.get(groupName);
          concatOptions(group.joinedEmployees, group.name);
        });
      }, {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Roles list
    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.approvalRoles),
      (data) => {
        if (!data) { return; }
        const value = Array.from(map(roles as string[], (i) => data.get(i)));
        map(value, (v) => concatOptions(v.joinedEmployees, v.name));
      }, {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function concatOptions (approvers: FBEmployee[], listGroup: string) {
      const approversList = approvers.filter((employee) => employee.active);
      let options = map(approversList, (o) => ({ ...o, listGroup }));
      options = sortBy(unionBy(buildTypeChangeApprovalState?.options || [], options, 'id'), 'listGroup');
      buildTypeChangeApprovalState?.setOptions(options as FBBuildTypeChangeApprovalOptions[]);
    }

    function concatApprovals (approval?: FBBuildTypeChangeApprovalBody | FBBuildTypeChangeApprovalBody[]) {
      if (!approval) { return; }
      return [approval].flat().map((app) => {
        const stateApprovals = filter(buildTypeChangeApprovalState?.approvals, (a) => a.approver?.id !== app?.approver?.id);
        buildTypeChangeApprovalState?.setApprovals(unionBy(stateApprovals, [app], 'id'));
        return app;
      });
    }

    function addApprover (ids?: string[]) {
      if (!id) { return; }
      map(ids, (approver) => buildTypeChangeApprovalState?.approvalBody({
        assigned: { id: approver },
        type: 'SECTION',
        fieldId: name,
        partOf: { id },
      }, () => {
        afterCallIsComplete();
      }));
    }

    function removeApprover (ids?: string[]) {
      if (!ids) { return; }
      map(ids, (approver) => {
        const approval = find(buildTypeChangeApprovalState?.getApprovals, (a) => a.approver?.id === approver);
        buildTypeChangeApprovalState?.approvalTransition('abandon', (approval as FBBuildTypeChangeApprovalBody)?.id, undefined, () => {
          afterCallIsComplete();
        });
      });
    }

    function afterCallIsComplete () {
      const { id } = workspaceState || {};
      if (!id) { return; }
      workspaceState?.saveDocRev(formState?.getValues());
      dispatch(documentRevisionsActions.loadAudit(id));
    }

    function requestAllApprovals (id?: string) {
      if (!id) { return; }
      const body = {
        docRev: pick(workspaceState?.document, 'id'),
      } as FBRequestApprovalTransitionBody;
      buildTypeChangeApprovalState?.requestApprovalTransition('pending_by_field', id, body, () => {
        const id = workspaceState?.id;
        if (id) { dispatch(documentRevisionsActions.loadAudit(id)); }
      });
      workspaceState?.saveDocRev(formState?.getValues());
    }

    // MARK: @methods
    approvalTransition = (transition: FBBuildTypeChangeApprovalTransition, id?: string, password?: string) => {
      if (!id) { return; }
      buildTypeChangeApprovalState?.approvalTransition(transition, id, { password }, () => {
        const { documentId } = workspaceState || {};
        documentId && buildTypeChangeApprovalState?.getDocument(documentId);
      });
    };

    onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: 'form.builder.password.prompt',
        open: true,
        content: <FBApprovalPasswordForm {...{ approvalId, approvalTransition }} />,
      });
    };

    // MARK: @observer
    useObserver(() => {
      options = buildTypeChangeApprovalState?.getOptions;
      approvals = buildTypeChangeApprovalState?.getApprovals;

      loading = (
        buildTypeChangeApprovalState?.approvalApi.loading
        || buildTypeChangeApprovalState?.transitionApi.loading
        || buildTypeChangeApprovalState?.documentApi.loading
      );

      disabled = loading
        || !(isOutput && Boolean(id))
        || document?.status === 'RELEASED'
        || document?.status === 'VOIDED';
      // || document?.revisionStage !== 1;
    });

    // MARK: @final config
    isApproved = (
      docVersion > 1
      && isEmpty(buildTypeChangeApprovalState.getApprovals)
      && Boolean(formState?.getFieldValue(name))
    ) ? some(fieldApprovals, (approval) => approval.status === 'APPROVED') || !fieldApprovals.length
      : !isUndefined(find(approvals, { status: 'APPROVED' }));

    return Component({
      ...(props as T),
      approvalTransition,
      requestAllApprovals,
      dialogState,
      buildTypeChangeApprovalState,
      currentUser,
      isApproved,
      isPreview,
      approvals,
      disabled,
      loading,
      options,
      name,
      onApproveClick,
      shouldShowApprovals,
      shouldShowRequestAllApprovals,
    });
  };

  Comp.displayName = 'withFBBuildTypeChangeApproval';
  return Comp;
};
