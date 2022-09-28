import { findIndex, isArray, map } from "lodash";
import { action, observable, set } from "mobx";
import { Approval } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBDataStoreApprovalKeys } from "../../documentRevision/forms/types";
import { FBInlineApprovalBody } from "../FBInlineApproval/FBInlineApproval.types";

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;
  @observable public poApprovals: FBInlineApprovalBody[] | Approval[] = [];
  @observable public inlineApprovals: FBInlineApprovalBody[] | Approval[] = [];

  @action public setRefreshData = (value) => {
    set(this, "refreshData", value);
  };
  @action public clearPoApprovals = () => {
    set(this, FBDataStoreApprovalKeys.PO_APPROVALS, []);
  };
  @action public clearInlineApprovals = () => {
    set(this, FBDataStoreApprovalKeys.INLINE_APPROVALS, []);
  };

  // key would be either "poApprovals", "inlineApprovals"
  @action public setApprovals = (approvals, key) => {
    let result: FBInlineApprovalBody[] | Approval[];
    if (isArray(approvals)) {
      result = [...this[key], ...approvals];
    } else {
      const approvalData = [...this[key]];
      let previousIndex = -1;
      if (key === FBDataStoreApprovalKeys.PO_APPROVALS) {
        previousIndex = findIndex(approvalData, (approval) => approval?.approverId === approvals.approverId);
      } else if (key === FBDataStoreApprovalKeys.INLINE_APPROVALS) {
        // There can be multiple inline approvals, & so the logic on approverId fails
        previousIndex = findIndex(approvalData, (approval) => approval?.id === approvals.id);
      }

      if (previousIndex < 0) {
        result = [...this[key], ...[approvals]];
      } else {
        result = map(approvalData, (el, index: number) => index === previousIndex ? approvals : el);
      }

    }
    set(this, key, result);
  };
}

export default new FBDataStore();
