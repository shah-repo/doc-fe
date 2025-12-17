import { Box } from '@material-ui/core';
import {
  compact,
  difference,
  filter,
  find,
  findIndex,
  get,
  isEmpty,
  isUndefined,
  map,
  unionBy,
  uniq,
} from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  FB,
  FBApprover,
  FBDialogState,
  FBInlineApprovalBody,
  FBRequiredApprover,
} from '..';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { Approval } from '../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import {
  ApprovalStatus,
  DocumentStatus,
} from '../../../state/ducks/documents/types';
import { taskActions } from '../../../state/ducks/tasks';
import { store } from '../../../state/store';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import {
  LHRS_ACCEPTED_QUANTITY,
  LHRS_REJECTED_QUANTITY,
  LHRS_START_DATE,
} from '../FBLHRStep/utils';
import FBStore from '../FBStore/FBStore';
import FBLHRStepApprovalsState from './FBLHRStepApprovals.state';
import {
  FBLHRStepApprovalsProps,
  FBLHRStepApprovalsStatusEndpoint,
} from './FBLHRStepApprovals.types';

export const withFBLHRStepApprovals = <T extends FBLHRStepApprovalsProps>(
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
    currentUser,
    ownerId,
    dialogState,
    owners,
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const {
      document,
      id,
      isOutput,
      externalState: {
        company: { companyMine: { employees = [] } = {} } = {},
      } = {},
    } = workspaceState || {};
    const { inputOwners = [] } = document || {};
    const ownerIds = uniq(Object.values(inputOwners as unknown as string));

    owners = employees
      .filter((e) => ownerIds.includes(e.id))
      .map((owner) => ({
        name: `${owner?.user?.name} (${owner?.user?.email})`,
        id: owner.id,
      }));

    const { owner: { user: { id: userId = '' } = {} } = {} } = document || {};

    disabled = disabled || isUndefined(id) || loading;

    if (
      !document?.formTemplate
      && [
        DocumentRevisionStatus.Approved,
        DocumentRevisionStatus.InReview,
      ].includes(documentStatus as DocumentRevisionStatus)
    ) {
      disabled = true;
    }

    const dispatch = useDispatch();
    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;
    currentUser = authUser.id;
    const outputId = isOutput ? id : null;
    let docApprovals = document?.approvals;
    if (!docApprovals?.length && FBStore.selectedApprover.length) {
      docApprovals = FBStore.selectedApprover;
    }
    const woApprovalsState = FB.useRef(FBLHRStepApprovalsState, {
      id: outputId,
      approvals: docApprovals,
      isOwner,
    });
    dialogState = FB.useRef(FBDialogState);

    approvalTransition = (
      transition: FBLHRStepApprovalsStatusEndpoint,
      approvalId?: string,
      password?: string,
    ) => {
      if (!approvalId) {
        return;
      }
      woApprovalsState?.applyTransition(transition, approvalId, { password });
    };

    function includesApprover (
      group: FBRequiredApprover,
      approver: string,
    ): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    const shouldSkipDefaultOwner = (): boolean => {
      return Object.keys(formState?.oldValues ?? {}).includes(LHRS_START_DATE);
    };

    React.useEffect(() => {
      const fieldValue = map(woApprovalsState?.getApprovals, 'approver.id');
      formState?.setFieldValue(name, fieldValue, false);

      const activeApprovals = filter(
        docApprovals,
        (a) => a.status !== 'ABANDONED',
      );
      // Auto-add current user as approver for LHR steps if not already added
      if (
        authUser
        && document?.status === DocumentRevisionStatus.Draft
        && document
        && !document?.formTemplate
        && !activeApprovals?.length
      ) {
        if (authUser.employeeId) {
          if (shouldSkipDefaultOwner()) {
            // Don't add default owner for LHR step fields - user will be added when they complete entries
            return;
          }
          addApprover([authUser.employeeId]);
          formState?.setFieldValue(name, [authUser.employeeId], false);
        }
      }

      formState?.inputState.get(name)?.setRender();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const completeWO = useActionCreator(taskActions.completeWO);

    const pendingApproval = useActionCreator(taskActions.pendingApproval);

    const closeWOAsync = useAsync({
      onSuccess: () => {
        workspaceState?.document?.id
          && dispatch(documentRevisionsActions.load(workspaceState?.document?.id));
      },
    });

    const pendingWOTriggeredRef = React.useRef(false);

    onApproveClick = (approvalId: string) => {
      if (
        !formState?.getInputState(LHRS_ACCEPTED_QUANTITY)?.value
        || !formState?.getInputState(LHRS_REJECTED_QUANTITY)?.value
      ) {
        toastError(
          'Error: Please fill in Accepted and Rejected quantity before approving.',
        );
        return;
      }
      closeWOAsync.start(completeWO, approvalId, closeWOAsync);
    };

    // On add approver
    React.useEffect(() => {
      const dispose = reaction(
        () => woApprovalsState?.approvalApi.data,
        (data) => {
          if (!data) {
            return;
          }
          document?.approvals?.push(data as Approval);
          FBStore.selectedApprover.push(data as Approval);
          concatApprovals(data);
        },
      );
      return () => dispose();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // On transition
    React.useEffect(() => {
      const dispose = reaction(
        () => woApprovalsState?.transitionApi.data,
        (data) => {
          concatApprovals(data);
          if (data?.status === DocumentStatus.Draft) {
            window.location.reload();
          }
        },
      );
      return () => dispose();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function concatApprovals (approval?: FBInlineApprovalBody) {
      if (!approval) {
        return;
      }
      if (approval.status === 'REJECTED' || approval.status === 'APPROVED') {
        window.location.reload();
      } else {
        const stateApprovals = filter(
          woApprovalsState?.approvals,
          (a) => a.approver?.id !== approval.approver?.id,
        );
        woApprovalsState?.setApprovals(
          unionBy(stateApprovals, [approval], 'id'),
        );
      }
    }

    React.useEffect(() => {
      const dispose = reaction(
        () => formState?.newValues.get(name),
        (fieldValue: string[]) => {
          if (workspaceState?.isPreview || !fieldValue) {
            return;
          }
          const formValue: string[] = get(formState?.oldValues, name);
          addApprover(difference(fieldValue, formValue));
          removeApprover(difference(formValue, fieldValue));
        },
      );
      return () => dispose();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      const dispose = reaction(
        () => ({
          smartReferencesTo: workspaceState?.smartReferencesTo,
          formInput: workspaceState?.formInput,
        }),
        () => {
          if (
            !woApprovalsState?.getApprovals?.some(
              (a) => a.approver?.id === authUser.employeeId,
            )
          ) {
            formState?.setFieldValue(name, [authUser.employeeId], false);
          }

          const currentUserApproval = woApprovalsState?.getApprovals?.find(
            (a) => a.approver?.id === authUser.employeeId && a.status === DocumentStatus.Approved,
          );

          if (currentUserApproval && !pendingWOTriggeredRef.current) {
            pendingWOTriggeredRef.current = true;
            closeWOAsync.start(pendingApproval, currentUserApproval.id, closeWOAsync);
          }
        },
      );
      return () => dispose();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function addApprover (ids?: string[]) {
      if (!id) {
        return;
      }
      map(ids, (approver) =>
        woApprovalsState?.addApproval(
          {
            assigned: { id: approver },
            type: 'MASTER',
            fieldId: name,
            partOf: { id },
          },
          () => {
            const { id } = workspaceState || {};
            if (!id) {
              return;
            }
            dispatch(documentRevisionsActions.loadAudit(id));
            if (!workspaceState?.autosave) {
              return;
            }
            workspaceState?.saveDocRev(formState?.getValues());
          },
        ),
      );
    }

    function removeApprover (ids?: string[]) {
      if (!ids) {
        return;
      }
      map(ids, (approver) => {
        const deletedApproverIndex = findIndex(
          document?.approvals,
          (a) =>
            a.approverId === approver
            && a.status === (ChangeRequestStatus.Draft as string),
        );
        const approval = find(
          woApprovalsState?.getApprovals,
          (a) => a.approver?.id === approver,
        );
        document?.approvals?.splice(deletedApproverIndex, 1);
        const SelApprover = findIndex(
          FBStore.selectedApprover,
          (a) =>
            a.approverId === approver
            && a.status === (ChangeRequestStatus.Draft as string),
        );
        FBStore.selectedApprover?.splice(SelApprover, 1);

        if (document?.approvals?.[deletedApproverIndex]) {
          document.approvals[deletedApproverIndex].status
            = ApprovalStatus.Abandoned;
        }
        woApprovalsState?.applyTransition(
          'abandon',
          (approval as FBInlineApprovalBody)?.id,
          undefined,
          () => {
            const id = workspaceState?.id;
            if (id) {
              dispatch(documentRevisionsActions.loadAudit(id));
            }
            if (!workspaceState?.autosave) {
              return;
            }
            workspaceState?.saveDocRev(formState?.getValues());
          },
        );
      });
    }

    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string[] = compact(
        map(groups, (group) =>
          includesApprover(group, option.id) ? group.name : '',
        ),
      );
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <Box fontWeight="fontWeightMedium">{option.user?.name}</Box>
          &nbsp;({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box>&nbsp;{`- ${requiredGroups.join(', ')}`}</Box>
          )}
        </Box>
      );
    };

    useObserver(() => {
      groups = woApprovalsState?.groups;
      approvals = woApprovalsState?.getApprovals;
      loading
        = woApprovalsState.loading
        || woApprovalsState?.approvalApi.loading
        || woApprovalsState?.transitionApi.loading;

      if (
        authUser
        && document?.status === DocumentRevisionStatus.Draft
        && document
        && !document?.formTemplate
      ) {
        if (shouldSkipDefaultOwner()) {
          return;
        }
        disabledOptions = [authUser?.employeeId];
        disableChipDelete = true;
      }
    });
    documentStatus = document?.status;

    return Component({
      ...(props as T),
      dialogState,
      approvals,
      name,
      loading,
      disabled,
      documentStatus,
      isRecord: isEmpty(document?.formTemplate),
      docId: id,
      approvalTransition,
      groups,
      renderOption,
      currentUser,
      ownerId,
      onApproveClick,
      owners,
      disabledOptions,
      disableChipDelete,
    });
  };

  Comp.displayName = 'withFBLHRStepApprovals';
  return Comp;
};
