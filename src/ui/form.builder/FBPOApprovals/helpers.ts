// Todo: ENC-13302 Business logic from this file should be moved to BE side.

import { compact, difference, isEmpty, map, minBy } from "lodash";
import { FBPurchaseOrderItemType, FBPurchaseOrderValue } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import { GroupType } from "../../../state/ducks/auth/types";
import FBPOApprovalsState from "./FBPOApprovals.state";
import { PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import { FBWorkspaceState } from "..";

export const checkServiceOrProductPartExists = (poItems: FBPurchaseOrderValue) => poItems?.items?.some((item) =>
  item.type === FBPurchaseOrderItemType.SERVICE
  || (item.type === FBPurchaseOrderItemType.PRODUCT && item.partNumberDocId)
);

interface CheckGroupsOptions {
  id: string;
  poApprovalsState: FBPOApprovalsState;
}

export const checkGroups = (options: CheckGroupsOptions) => {
  const { id, poApprovalsState } = options;

  const approversGroups = compact(map(poApprovalsState.groups, (group) =>
    (group.joinedEmployees as string[]).includes(id) ? group : ""));
  const poamGroups = approversGroups.filter((group) => group.type === GroupType.PURCHASE_APPROVAL);
  const damGroups = approversGroups.filter((group) => group.type === GroupType.REVISION_APPROVAL);

  if (isEmpty(poApprovalsState.checkedGroups)) {
    const groupToSign = minBy(poamGroups, "documentStage");
    poApprovalsState.setCheckedGroups(groupToSign);
    if (damGroups) {
      const damsToSign = difference(damGroups, poApprovalsState.checkedGroups || []);
      damsToSign.map((dam) => poApprovalsState.setCheckedGroups((dam)));
    }
    return groupToSign?.name;
  } else {
    const sign = minBy(difference(poamGroups, poApprovalsState.checkedGroups || []), "documentStage");
    poApprovalsState.setCheckedGroups(sign);
    if (damGroups) {
      const damsToSign = difference(damGroups, poApprovalsState.checkedGroups || []);
      damsToSign.map((dam) => poApprovalsState.setCheckedGroups((dam)));
    }
    return sign?.name;
  }
};

interface CheckLineItemsOptions {
  workspaceState: FBWorkspaceState;
  poApprovalsState: FBPOApprovalsState;
  prevRequesterValue?: string;
  poItems?: FBPurchaseOrderValue;
  addApprover: (ids: string[], options?: { manually?: boolean }) => void;
  removeApprover: (ids: string[]) => void;
}

export const checkLineItems = (options: CheckLineItemsOptions) => {
  const { workspaceState, poApprovalsState, prevRequesterValue, addApprover, removeApprover } = options;
  const { revisionChangeType, document, formInputSync } = workspaceState;
  const { getApprovals } = poApprovalsState;

  const isAdministrativeChange = revisionChangeType === RevisionChangeType.AdministrativeChange;
  const shouldUpdateApprovers = isDocumentRevisionInDraft(document?.status) && !isAdministrativeChange;

  if (!shouldUpdateApprovers) {
    return;
  }

  const poItems = options.poItems ?? formInputSync.get(PO_ITEMS_COMPONENT_NAME);
  const requester = formInputSync.get(PO_REQUESTOR_COMPONENT_NAME);
  const hasServiceOrProductPart = checkServiceOrProductPartExists(poItems);

  const allApprovers = getApprovals?.map((item) => item?.approver?.id);
  const hasRequesterInAllApprovers = allApprovers?.includes(requester);

  if (requester && !hasRequesterInAllApprovers && hasServiceOrProductPart) {
    return addApprover([requester], { manually: false });
  }

  // We can remove only automatically added approvers.
  const autoApprovers = getApprovals?.filter((item) => !item.manually)
    ?.map((item) => item?.approver?.id);
  const hasRequesterInAutoApprovers = autoApprovers?.includes(requester);
  const hasPrevRequesterInAutoApprovers = autoApprovers?.includes(prevRequesterValue as string);

  if (requester && hasRequesterInAutoApprovers && !hasServiceOrProductPart) {
    return removeApprover([requester]);
  }

  if (!requester && prevRequesterValue && hasPrevRequesterInAutoApprovers) {
    return removeApprover([prevRequesterValue]);
  }
};
