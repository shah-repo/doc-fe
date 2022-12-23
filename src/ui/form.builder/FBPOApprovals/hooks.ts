// Todo: ENC-13302 Business logic from this file should be moved to BE side.

import { compact, difference, find, isEmpty, map, minBy, some, sortBy } from "lodash";
import { reaction, when } from "mobx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FB, FBInlineApprovalBody, FBPurchaseOrderValue } from "..";
import { GroupType } from "../../../state/ducks/auth/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { ApprovalStatus } from "../../../state/ducks/documents/types";
import { FBDataStoreApprovalKeys } from "../../documentRevision/forms/types";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import { checkServiceOrProductPartExists } from "../FBPurchaseOrderTable/helpers";
import FBDataStore from "../FBStore/FBDataStore";

interface CheckApprovalsArguments {
  prevRequester?: string;
  poItems?: FBPurchaseOrderValue;
}

export const usePoApprovals = (
  fieldName: string,
  id?: string,
) => {
  const dispatch = useDispatch();
  const { workspaceState, poApprovalsState } = FB.useStores();

  const getSignatureGroupName = (id: string) => {
    const approversGroups = compact(map(poApprovalsState?.groups, (group) =>
      (group.joinedEmployees as string[]).includes(id) ? group : ""));
    const poamGroups = approversGroups.filter((group) => group.type === GroupType.PURCHASE_APPROVAL);

    if (isEmpty(poApprovalsState?.checkedGroups)) {
      const groupToSign = minBy(poamGroups, "documentStage");
      return groupToSign?.name;
    } else {
      const sign = minBy(difference(poamGroups, poApprovalsState?.checkedGroups ?? []), "documentStage");
      return sign?.name;
    }
  };

  const updateApprovalSignatureGroupName = async (approval: FBInlineApprovalBody) => {
    if (some(poApprovalsState?.checkedGroups, { name: approval.signatureGroupName }) || !approval.approverId) {
      return approval;
    }

    const updatedSignatureGroupName = getSignatureGroupName(approval.approverId);

    if (updatedSignatureGroupName) {
      return poApprovalsState?.updateSignatureGroupName(
        approval.id,
        updatedSignatureGroupName
      );
    }
  };

  const updateSignaturesQueue = async (approvals: string[]) => {
    for (const approvalId of approvals) {
      const currentApproval = poApprovalsState?.activeApprovals.find((approval) => approval.id === approvalId);
      if (currentApproval) {
        await updateApprovalSignatureGroupName(currentApproval);
      }
    }
  };

  const updateSignatureGroupNames = async () => {
    const isAdministrativeChange = workspaceState?.revisionChangeType === RevisionChangeType.AdministrativeChange;

    const shouldUpdate =
      isDocumentRevisionInDraft(workspaceState?.document?.status)
      && !isAdministrativeChange
      && poApprovalsState?.requireAdditionalApprovers;

    if (!shouldUpdate) {
      return;
    }

    return updateSignaturesQueue(
      sortBy(poApprovalsState?.activeApprovals, "signatureGroupName").map((approval) => approval.id)
    );
  };

  const hasUserInApprovers = (approverId: string, approversList?: FBInlineApprovalBody[]) =>
    some(approversList ?? poApprovalsState?.activeApprovals, { approverId });

  const updateApprovals = async ({ prevRequester, ...args }: CheckApprovalsArguments) => {
    const { revisionChangeType, document, formInputSync } = workspaceState ?? {};

    const shouldUpdateApprovers = isDocumentRevisionInDraft(document?.status);

    if (!shouldUpdateApprovers) {
      return;
    }

    const poItems = args.poItems ?? formInputSync?.get(PO_ITEMS_COMPONENT_NAME);
    const requester = formInputSync?.get(PO_REQUESTOR_COMPONENT_NAME);
    const autoApprovers = poApprovalsState?.activeApprovals.filter((item) => !item.manually);

    const administativeRevisionTypes = [RevisionChangeType.AdministrativeChange, RevisionChangeType.Obsolete];
    const isAdministrativeChange = administativeRevisionTypes.includes(revisionChangeType as RevisionChangeType);

    const hasServiceOrProductPart = checkServiceOrProductPartExists(poItems);
    const hasRequesterInAllApprovers = hasUserInApprovers(requester);
    const hasRequesterInAutoApprovers = hasUserInApprovers(requester, autoApprovers);
    const hasPrevRequesterInAutoApprovers = hasUserInApprovers(prevRequester ?? "", autoApprovers);

    const shouldAddRequester = !hasRequesterInAllApprovers && hasServiceOrProductPart && !isAdministrativeChange;
    const shouldRemoveRequester = hasRequesterInAutoApprovers && (!hasServiceOrProductPart || isAdministrativeChange);
    const shouldRemovePrevRequester = requester !== prevRequester && hasPrevRequesterInAutoApprovers;

    if (requester && shouldRemoveRequester) {
      return removeApprover([requester]);
    }

    if (prevRequester && shouldRemovePrevRequester) {
      return removeApprover([prevRequester]).then(() => {
        if (requester) {
          addApprover([requester], { manually: false });
        }
      });
    }

    if (requester && shouldAddRequester) {
      return addApprover([requester], { manually: false });
    }
  };

  const addApprover = async (ids: string[], { manually = true } = {}) => {
    if (!id || !ids) {
      return Promise.reject();
    }

    await when(() => Boolean(poApprovalsState?.isMounted) && Boolean(poApprovalsState?.idle));

    const addActions = ids
      .filter((user) => !hasUserInApprovers(user))
      .map((approver) => {
        const signatureGroupName = getSignatureGroupName(approver);
        return poApprovalsState?.addApproval({
          assigned: { id: approver },
          type: "MASTER",
          fieldId: fieldName,
          partOf: { id },
          signatureGroupName,
          manually,
        });
      });

    return Promise.all(addActions).then(() => {
      const id  = workspaceState?.id;
      if (id) {
        dispatch(documentRevisionsActions.loadAudit(id));
      }
    });
  };

  const removeApprover = async (ids?: string[]) => {
    if (!ids || !id) {
      return Promise.reject();
    }

    await when(() => Boolean(poApprovalsState?.isMounted) && Boolean(poApprovalsState?.idle));

    const removeActions = map(ids, (approver) => {
      const approval = find(poApprovalsState?.activeApprovals, (a) => a.approver?.id === approver);
      if (approval?.status === ApprovalStatus.Abandoned) {
        return;
      }
      return poApprovalsState?.applyTransition("abandon", approval?.id, undefined);
    });

    return Promise.all(removeActions).then(() => {
      const id = workspaceState?.id;
      if (id) {
        dispatch(documentRevisionsActions.loadAudit(id));
      }
    });
  };

  const fetchRequiredGroups = () => {
    if (id) {
      return poApprovalsState?.fetchRequiredApprovals([id]);
    }
  };

  useEffect(() => reaction(
    () => Object.values((poApprovalsState?.groups ?? {})).slice(),
    (groups) => {
      if (groups && workspaceState) {
        updateSignatureGroupNames();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  useEffect(() => reaction(
    () => poApprovalsState?.approvalApi.data,
    (data) => {
      FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.PO_APPROVALS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  useEffect(() => reaction(
    () => poApprovalsState?.transitionApi.data,
    (data) => {
      FBDataStore.setApprovals(data, FBDataStoreApprovalKeys.PO_APPROVALS);
      if (id && [ApprovalStatus.Approved, ApprovalStatus.Rejected].includes(data?.status as ApprovalStatus)) {
        // TODO investigate why reload here sometimes causes blink and returns to prev state
        return dispatch(documentRevisionsActions.load(id));
      }
      updateSignatureGroupNames();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return {
    poApprovalsState,
    addApprover,
    removeApprover,
    fetchRequiredGroups,
    hasUserInApprovers,
    updateApprovals,
    updateSignatureGroupNames,
  };
};
