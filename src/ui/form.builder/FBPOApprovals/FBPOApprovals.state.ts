import { Approval } from "aws-sdk/clients/codecommit";
import { every, filter, isEmpty, map, unionBy, values } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBInlineApprovalBody, FBInlineApprovalTransition, FBInlineApprovalTransitionBody, FBJoinedEmployee, FBPOApprovalsConstructor, FBPOInlineApprovalUpdateBody, FBRequiredApprover } from "..";
import { GroupType } from "../../../state/ducks/auth/types";
import { ApprovalStatus } from "../../../state/ducks/common/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBPOApprovalsState extends FBRequest<Approval, {"ids[]": string[]} | Approval> {
  @observable public groups?: Record<string, FBRequiredApprover> = {};
  @observable approvals?: FBInlineApprovalBody[];
  @observable public isMounted = false;

  // MARK: @config
  public approvalApi = new FBRequest<FBInlineApprovalBody, Partial<FBInlineApprovalBody>>(FBEndpoint.Approvals);
  public transitionApi =
  new FBRequest<FBInlineApprovalBody, FBInlineApprovalTransitionBody | null>(FBEndpoint.ApprovalsTransition);
  public updateApi = new FBRequest<FBInlineApprovalBody, FBPOInlineApprovalUpdateBody>(FBEndpoint.ApprovalsUpdate);

  public constructor({ id, approvals }: FBPOApprovalsConstructor) {
    super();
    this.approvals = filter(approvals, (a) => a.status !== "ABANDONED");
    if (!id) {
      return;
    }
    this.fetchRequiredApprovals(id);
    this.setMounted(true);
  }

  // MARK: @computed
  @computed public get activeApprovals(): FBInlineApprovalBody[] {
    return filter(this.approvals, (a) => a.status !== "ABANDONED" && a.type === "MASTER");
  }

  @computed public get requireAdditionalApprovers() {
    return values(this.groups).length > 0 && values(this.groups).length !== this.checkedGroups?.length;
  }

  @computed public get haveAllApprovals() {
    return every(this.activeApprovals, { status: ApprovalStatus.Approved });
  }

  @computed public get checkedGroups() {
    return this.activeApprovals?.reduce<FBRequiredApprover[]>((groups, approval) => {
      const signedGroup = values(this.groups).find(
        (group) => {
          const poApproval = group.name === approval.signatureGroupName;
          const revisionApproval = approval.approverId
            && (group.joinedEmployees as string[]).includes(approval.approverId)
            && (group.type === GroupType.REVISION_APPROVAL);
          return poApproval || revisionApproval;
        }
      );
      return signedGroup ? [...groups, signedGroup] : groups;
    }, []) ?? [];
  }

  public fetchRequiredApprovals = (documentRevisions: string[] = []) => {
    if (isEmpty(documentRevisions)) {
      this.groups = {};
      return;
    }
    this.setUrl(FBEndpoint.RequiredApprovers);
    this.setBody({ "ids[]": documentRevisions });
    return this.fetch();
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

  @action public setMounted = (mount: boolean) =>
    set(this, "isMounted", mount);

  @action public upsertApproval = (approval: FBInlineApprovalBody) => {
    this.setApprovals(unionBy([approval], this.approvals, "id"));
  };

  public addApproval = (
    approval: Partial<FBInlineApprovalBody>,
    callback?: () => void
  ) => {
    this.approvalApi.set({
      url: FBEndpoint.Approvals,
      body: approval,
      method: "post",
    }, (data, error) => {
      if (error) {
        return this.approvalApi.onError(error);
      }
      if (data) {
        this.upsertApproval(data);
      }
      this.approvalApi.data = data;
      this.approvalApi.onSuccess();
      callback?.();
    });
  };

  public applyTransition = (
    transition: FBInlineApprovalTransition,
    id?: string,
    body?: FBInlineApprovalTransitionBody,
    callback?: () => void
  ) => {
    if (!id) { return; }
    this.transitionApi.set({
      url: FBEndpoint.ApprovalsTransition,
      urlValues: { id, transition },
      body,
      method: "post",
    }, (data, error) => {
      if (error) {
        return this.transitionApi.onError(error);
      }
      if (data) {
        this.upsertApproval(data);
      }
      this.transitionApi.data = data;
      this.transitionApi.onSuccess();
      callback?.();
    });
  };

  public updateSignatureGroupName = (
    id: string,
    signatureGroupName: string,
    callback?: () => void
  ) => {
    this.updateApi.set({
      url: FBEndpoint.ApprovalsUpdate,
      urlValues: { id },
      body: {
        signatureGroupName,
      },
      method: "post",
    }, (data, error) => {
      if (error) {
        return this.updateApi.onError(error);
      }
      if (data) {
        this.upsertApproval(data);
      }
      this.updateApi.data = data;
      this.updateApi.onSuccess();
      callback?.();
    });
  };
}

export default FBPOApprovalsState;


