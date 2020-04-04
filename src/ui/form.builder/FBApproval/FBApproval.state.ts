import _ from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalValue } from ".";

export class FBApprovalState {
  @observable public hasApproved: FBApprovalValue[] = [];

  @computed public get isApproved(): boolean {
    return !_.isEmpty(this.hasApproved);
  }

  @action public addApprover = (value: FBApprovalValue) => {
    set(this, "hasApproved", _.union(this.hasApproved, [value]));
  };

  @action public setApprovers = (approvers: FBApprovalValue[]) => {
    set(this, "hasApproved", approvers);
  };
}

export default FBApprovalState;
