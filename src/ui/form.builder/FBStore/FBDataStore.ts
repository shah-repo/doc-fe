import { findIndex, isArray, map } from "lodash";
import { action, observable, set } from "mobx";
import { Approval } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBInlineApprovalBody } from "../FBInlineApproval/FBInlineApproval.types";

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;
  @observable public poApprovals: FBInlineApprovalBody[] | Approval[] = [];
  @observable public inlineApprovals: FBInlineApprovalBody[] | Approval[] = [];

  @action public setRefreshData = (value) => {
    set(this, "refreshData", value);
  };
  @action public clearPoApprovals = () => {
    set(this, "poApprovals", []);
  };
  @action public clearInlineApprovals = () => {
    set(this, "inlineApprovals", []);
  };

  // key would be either "poApprovals", "inlineApprovals"
  @action public setApprovals = (approvals, key) => {
    let result: FBInlineApprovalBody[] | Approval[];
    if (isArray(approvals)) {
      result = [...this[key], ...approvals];
    } else {
      const approvalData = [...this[key]];
      const previousIndex = findIndex(approvalData, (po) => po?.approverId === approvals.approverId);
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
