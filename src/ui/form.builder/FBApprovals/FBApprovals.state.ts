import { isEmpty, map, template } from "lodash";
import { observable, set } from "mobx";
import { FBApprovalsStatusEndpoint } from ".";
import { Approval } from "../../../state/ducks/common";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBJoinedEmployee, FBRequiredApprover } from "../FBApprovers";

export class FBApprovalsState extends FBRequest<any, any> {
  @observable public groups?: Record<string, FBRequiredApprover> = {};
  @observable public approvals?: Approval[];

  public constructor({ id, approvals }) {
    super();
    this.approvals = approvals;
    this.fetchRequiredApprovals(id);
  }

  public fetchRequiredApprovals = (documentRevisions: string[] = []) => {
    if (isEmpty(documentRevisions)) {
      this.groups = {};
      return;
    }
    this.setUrl(FBEndpoint.RequiredApprovers);
    this.setBody({ "ids[]": documentRevisions });
    this.fetch();
  };

  protected onSuccess() {
    super.onSuccess();
    if (
      this.method === "post"
      && this.data
      && !this.approvals?.find((app) => app.id === this.data?.id)
    ) {
      const newApprovals = this.approvals || [];
      newApprovals.push(this.data);
      set(this, "approvals", newApprovals);
    } else if (this.method === "get") {
      this.groups = (this.data || []).reduce((group, item) => {
        group[item.id] = {
          ...item,
          joinedEmployees: map(item.joinedEmployees as FBJoinedEmployee[], "id"),
        };
        return group;
      }, {});
      return this.data;
    }
  }

  public setApprovals = (approvals?: Approval[]) => {
    this.approvals = approvals;
  };

  public getApproval = (id?: string): Approval | undefined => this.approvals?.find((approval) => approval.id === id);

  public addApproval = (approval: Approval) => {
    this.setUrl(FBEndpoint.Approvals);
    this.setBody(approval);
    this.post();
  };

  public applyTransition = (transition: FBApprovalsStatusEndpoint, approvalId: string) => {
    const urlTpl = template(FBEndpoint.ApplyApprovalTransition);
    const url = urlTpl({ approvalId, transition });
    this.setUrl(url);
    this.post();
  };
}

export default FBApprovalsState;
