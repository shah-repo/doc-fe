import { Approval } from "aws-sdk/clients/codecommit";
import { compact, filter, isEmpty, map, values } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBInlineApprovalBody, FBInlineApprovalTransition, FBInlineApprovalTransitionBody, FBJoinedEmployee, FBPOApprovalsConstructor, FBRequiredApprover } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBPOApprovalsState extends FBRequest<Approval, {"ids[]": string[]} | Approval> {
  @observable public groups?: Record<string, FBRequiredApprover> = {};
  @observable public checkedGroups?: any[];
  @observable approvals?: FBInlineApprovalBody[];

  // MARK: @config
  public approvalApi = new FBRequest<FBInlineApprovalBody, FBInlineApprovalBody>(FBEndpoint.Approvals);
  public transitionApi =
  new FBRequest<FBInlineApprovalBody, FBInlineApprovalTransitionBody | null>(FBEndpoint.ApprovalsTransition);

  public constructor({ id, approvals }: FBPOApprovalsConstructor) {
    super();
    this.approvals = filter(approvals, (a) => a.status !== "ABANDONED");
    if (!id) {
      return;
    }
    this.fetchRequiredApprovals(id);
    this.checkedGroups = [];
  }

  // MARK: @computed
  @computed public get getApprovals(): FBInlineApprovalBody[] {
    return filter(this.approvals, (a) => a.status !== "ABANDONED" && a.type === "MASTER");
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
    this.setGroups(this.data);
    const filteredCheckedGroups = map(this.approvals, (approval) => values(this.groups)?.find((group) =>
      group.name === approval.signatureGroupName));

    map(this.approvals, (approval) => {
      map(this.groups, (group) => {
        // eslint-disable-next-line max-len
        if ((group.joinedEmployees as string[]).includes(approval.approverId || "") && group.type === "REVISION_APPROVAL") {
          filteredCheckedGroups.push(group);
        }
      });
    });

    this.checkedGroups = compact(filteredCheckedGroups);
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

  @action public setCheckedGroups = (data) => {
    if (!data) { return; }
    this.checkedGroups?.push(data);
  };

  @action public removeCheckedGroups = (name?: string) => {
    if (!name) { return; }
    const filteredGroups = this.checkedGroups?.filter((group) => group.name !== name);
    set(this, "checkedGroups", filteredGroups);
  };

  @action public setApprovals = (approvals?: FBInlineApprovalBody[]) =>
    set(this, "approvals", approvals);

  public addApproval = (approval: FBInlineApprovalBody) => {
    this.approvalApi.setBody(approval);
    this.approvalApi.post();
  };

  public applyTransition = (
    transition: FBInlineApprovalTransition,
    id?: string,
    body?: FBInlineApprovalTransitionBody,
  ) => {
    if (!id) { return; }
    this.transitionApi.set({
      url: FBEndpoint.ApprovalsTransition,
      urlValues: { id, transition },
      body,
      method: "post",
    });
  };
}

export default FBPOApprovalsState;


