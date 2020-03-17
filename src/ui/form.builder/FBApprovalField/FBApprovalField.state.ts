import _ from "lodash";
import { action, observable, set } from "mobx";

export class FBApprovalFieldState {
  @observable public hasApproved: string[] = [];

  @action public addApprover = (email: string) => {
    // this.hasApproved.push(email);
    set(this, "hasApproved", _.union(this.hasApproved, [email]));
  };

  @action public removeApprover = (email: string) => {
    this.hasApproved = _.filter(this.hasApproved, (approver) => approver !== email);
  };

  @action public setApprovers = (approvers: string[]) => {
    set(this, "hasApproved", approvers);
  };
}

export default FBApprovalFieldState;
