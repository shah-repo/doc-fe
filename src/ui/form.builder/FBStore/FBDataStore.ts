import { findIndex, isArray, map } from "lodash";
import { action, observable, set } from "mobx";
import { Approval } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBInlineApprovalBody } from "../FBInlineApproval/FBInlineApproval.types";

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;
  @observable public poApprovals: FBInlineApprovalBody[] | Approval[] = [];

  @action public setRefreshData = (value) => {
    set(this, "refreshData", value);
  };

  @action public setPoApprovals = (approvals) => {
    let result: FBInlineApprovalBody[] | Approval[];
    if (isArray(approvals)) {
      result = [...this.poApprovals, ...approvals];
    } else {
      const approvalData = [...this.poApprovals];
      const previousIndex = findIndex(approvalData, (po) => po?.approverId === approvals.approverId);
      if (previousIndex < 0) {
        result = [...this.poApprovals, ...[approvals]];
      } else {
        result = map(approvalData, (el, index: number) => index === previousIndex ? approvals : el);
      }
    }
    set(this, "poApprovals", result);
  };
}

export default new FBDataStore();
