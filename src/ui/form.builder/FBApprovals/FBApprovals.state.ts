import { filter, isEmpty, map, template } from "lodash";
import { observable } from "mobx";
import { FBApprovalsStatusEndpoint } from ".";
import { FBFormState } from "..";
import { Approval } from "../../../state/ducks/common";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBJoinedEmployee, FBRequiredApprover } from "../FBApprovers";

export class FBApprovalsState extends FBRequest<Approval, {"ids[]": string[]} | Approval> {
  @observable public groups?: Record<string, FBRequiredApprover> = {};
  public approvals?: Approval[];
  private formState?: FBFormState;

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

  public onSuccess() {
    if (
      this.method === "post"
    ) {
      const { id } = this.data as Approval;
      const approvals = filter(this.approvals, (app) => app.id !== id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.setApprovals([...approvals, ...[this.data!]]);
      this.formState?.reset();
    } else if (this.method === "get") {
      this.setGroups(this.data);
    }
    super.onSuccess();
  }

  private setGroups = (data) => {
    this.groups = (data || []).reduce((group, item) => {
      group[item.id] = {
        ...item,
        joinedEmployees: map(item.joinedEmployees as FBJoinedEmployee[], "id"),
      };
      return group;
    }, {});
  };

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
