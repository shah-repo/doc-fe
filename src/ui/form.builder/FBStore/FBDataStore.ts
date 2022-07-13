import { findIndex, isArray } from "lodash";
import { action, observable, set } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;
  @observable public poApprovals: any[] = [];

  @action public setRefreshData = (value) => {
    set(this, "refreshData", value);
  };

  @action public setPoApprovals = (approvals) => {
    let result: any[] = [];
    if (isArray(approvals)) {
      result = [...this.poApprovals, ...approvals];
    } else {
      const previousIndex = findIndex(this.poApprovals, (po) => po.approverId === approvals.approverId);
      if (previousIndex < 0) {
        result = [...this.poApprovals, ...[approvals]];
      } else {
        result = this.poApprovals.map((el, index) => index === previousIndex ? approvals : el);
      }
    }
    set(this, "poApprovals", result);
  };
}

export default new FBDataStore();
