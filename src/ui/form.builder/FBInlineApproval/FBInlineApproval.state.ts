import { filter, map, uniqBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import {
  FBAutocompleteAsyncOption,
  FBAutocompleteAsyncState,
  FBInlineApprovalBody,
  FBInlineApprovalConstructor,
  FBInlineApprovalOptions,
  FBInlineApprovalTransition,
  FBInlineApprovalTransitionBody,
} from "..";
import { Document } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBInlineApprovalState {
  // MARK: @observables
  @observable public options?: FBInlineApprovalOptions[];
  @observable approvals?: FBInlineApprovalBody[];

  // MARK: @config
  private isOwner?: boolean;

  // MARK: @api
  public approversApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.availableApprovers);
  public groupsApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.groups);
  public rolesApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.approvalRoles);
  public approvalApi = new FBRequest<FBInlineApprovalBody, FBInlineApprovalBody>(FBEndpoint.Approvals);
  public transitionApi = new FBRequest<FBInlineApprovalBody, FBInlineApprovalTransitionBody | null>();
  public documentApi: FBRequest<Document, null> = new FBRequest();

  // MARK: @constructor
  public constructor(props: FBInlineApprovalConstructor) {
    this.initialApprovals(props);
  }

  // MARK: @computed
  @computed public get getApprovals(): FBInlineApprovalBody[] {
    const filtered = filter(this.approvals, (a) => a.status !== "ABANDONED");
    return map(filtered, (a: FBInlineApprovalBody) => ({
      ...a,
      canRequest: this.isOwner && a.status === "DRAFT",
    }));
  }

  @computed public get getOptions(): FBInlineApprovalOptions[] {
    return uniqBy(this.options, "user.id");
  }

  // MARK: @actions
  @action public setOptions = (options?: FBInlineApprovalOptions[]) =>
    set(this, "options", options);

  @action public setApprovals = (approvals?: FBInlineApprovalBody[]) =>
    set(this, "approvals", approvals);

  // MARK: @helpers
  public initialApprovals = ({ approvals, isOwner }: FBInlineApprovalConstructor) => {
    approvals = filter(approvals, (a) => a.status !== "ABANDONED");
    this.setApprovals(approvals);
    this.isOwner = isOwner;
    const approvers = map(approvals, "approver");
    const options = map(approvers, (o) => ({ ...o, listGroup: "Approvers" })) as FBInlineApprovalOptions[];
    this.setOptions(options);
  };

  public approvalBody = (body: FBInlineApprovalBody) => {
    this.approvalApi.setBody(body);
    this.approvalApi.post();
  };

  public approvalTransition = (
    transition: FBInlineApprovalTransition,
    id?: string,
    body?: FBInlineApprovalTransitionBody,
  ) => {
    if (!id) { return; }
    this.transitionApi.setTemplateUrl(FBEndpoint.ApprovalsTransition, { id, transition });
    if (body) {
      this.transitionApi.setBody(body);
    }
    this.transitionApi.post();
  };

  public getDocument = (id?: string) => {
    if (!id) { return; }
    this.documentApi.setTemplateUrl(FBEndpoint.Document, { id });
    this.documentApi.fetch();
  };
}

export default FBInlineApprovalState;
