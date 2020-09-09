import { filter, isEmpty, map } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalsConstructor } from ".";
import { FBInlineApprovalBody, FBInlineApprovalTransition } from "..";
import { Approval } from "../../../state/ducks/common";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBJoinedEmployee, FBRequiredApprover } from "../FBApprovers";

export class FBApprovalsState extends FBRequest<Approval, {"ids[]": string[]} | Approval> {
  @observable public groups?: Record<string, FBRequiredApprover> = {};
  @observable approvals?: FBInlineApprovalBody[];

  // MARK: @config
  private isOwner?: boolean;

  public approvalApi = new FBRequest<FBInlineApprovalBody, FBInlineApprovalBody>(FBEndpoint.Approvals);
  public transitionApi = new FBRequest<FBInlineApprovalBody, null>();

  public constructor({ id, approvals, isOwner }: FBApprovalsConstructor) {
    super();
    this.approvals = filter(approvals, (a) => a.status !== "ABANDONED");
    this.isOwner = isOwner;
    this.fetchRequiredApprovals(id);
  }

  // MARK: @computed
  @computed public get getApprovals(): FBInlineApprovalBody[] {
    const filtered = filter(this.approvals, (a) => a.status !== "ABANDONED");
    return map(filtered, (a: FBInlineApprovalBody) => ({
      ...a,
      canRequest: this.isOwner && a.status === "DRAFT",
    }));
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

  @action public setApprovals = (approvals?: FBInlineApprovalBody[]) =>
    set(this, "approvals", approvals);

  public addApproval = (approval: FBInlineApprovalBody) => {
    this.approvalApi.setBody(approval);
    this.approvalApi.post();
  };

  public applyTransition = (transition: FBInlineApprovalTransition, id?: string) => {
    if (!id) { return; }
    this.transitionApi.setTemplateUrl(FBEndpoint.ApprovalsTransition, { id, transition });
    this.transitionApi.post();
  };
}

export default FBApprovalsState;
