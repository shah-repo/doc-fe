import _ from "lodash";
import { action, observable, set } from "mobx";
import moment from "moment";
import { FBApprovedFieldValue } from ".";

export class FBApprovalFieldState {
  @observable public hasApproved: FBApprovedFieldValue[] = [];

  @action public addApprover = (identifiers: string[]) => {
    const approverValue: FBApprovedFieldValue[] = _.map(identifiers, (identifier) => ({
      approvedAt: moment().format("MMMM D, YYYY h:mm a"),
      identifier,
    }));
    set(this, "hasApproved", _.union(this.hasApproved, approverValue));
  };

  @action public removeApprover = (identifier: string) => {
    this.hasApproved = _.filter(this.hasApproved, (approver) => approver.identifier !== identifier);
  };

  @action public setApprovers = (approvers: FBApprovedFieldValue[]) => {
    set(this, "hasApproved", approvers);
  };
}

export default FBApprovalFieldState;
