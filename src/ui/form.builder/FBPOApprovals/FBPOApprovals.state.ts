import { Approval } from "aws-sdk/clients/codecommit";
import { compact, each, filter, isEmpty, map, values } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBInlineApprovalBody, FBInlineApprovalTransition, FBInlineApprovalTransitionBody, FBJoinedEmployee, FBPOApprovalsConstructor, FBPurchaseOrderValue, FBRequiredApprover } from "..";
import { GroupType } from "../../../state/ducks/auth/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBPOApprovalsState extends FBRequest<Approval, {"ids[]": string[]} | Approval> {
  @observable public groups?: Record<string, FBRequiredApprover> = {};
  @observable public checkedGroups?: any[];
  @observable approvals?: FBInlineApprovalBody[];
  @observable public isRequiredApprovals = false;
  @observable public prevPOItems;
  @observable public didMountPhase = false;

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
    this.setDidMount(true);
    this.checkedGroups = [];
  }

  // MARK: @computed
  @computed public get getApprovals(): FBInlineApprovalBody[] {
    return filter(this.approvals, (a) => a.status !== "ABANDONED" && a.type === "MASTER");
  }

  @computed public get getIsRequiredApprovals() {
    return this.isRequiredApprovals;
  }

  @computed public get getPrevPOItems() {
    return this.prevPOItems;
  }

  @computed public get getDidMountPhase() {
    return this.didMountPhase;
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

    const filteredCheckedGroups = map(this.approvals, (approval) =>
      values(this.groups)?.find(
        (group) => group.name === approval.signatureGroupName
      )
    );

    each(this.approvals, (approval) => {
      each(this.groups, (group) => {
        if (
          approval.approverId
          && (group.joinedEmployees as string[]).includes(approval.approverId)
          && (group.type === GroupType.REVISION_APPROVAL)
        ) {
          filteredCheckedGroups.push(group);
        }
      });
    });

    this.checkedGroups = compact(filteredCheckedGroups);
    this.setIsRequiredApprovals();
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

  @action public setIsRequiredApprovals = () =>
    set(this, "isRequiredApprovals", !this.isRequiredApprovals);

  @action public setPrevPOItems = (poItems: FBPurchaseOrderValue) =>
    set(this, "prevPOItems", poItems);

  @action public setDidMount = (mount: boolean) =>
    set(this, "didMountPhase", mount);


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
      this.approvalApi.data = data;
      this.onSuccess();
      this.approvalApi.onSuccess(); // removes the loader
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
      this.updateApi.data = data;
      this.updateApi.onSuccess();
      callback?.();
    });
  };
}

export default FBPOApprovalsState;


