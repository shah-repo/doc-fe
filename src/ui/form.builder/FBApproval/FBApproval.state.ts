import _ from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalApi, FBApprovalConstructor, FBApprovalData, FBApprovalValue } from ".";
import { FBAutocompleteAsyncOption } from "..";
import { Audit } from "../../../state/ducks/audit";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBAutocompleteAsyncState } from "../FBAutocompleteAsync/FBAutocompleteAsync.state";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export class FBApprovalState {
  @observable public hasApproved: FBApprovalValue[] = [];
  @observable public auditData?: Audit[];
  public postApi: FBRequest<any, FBApprovalApi> = new FBRequest();
  public approversApi: FBAutocompleteAsyncState = new FBAutocompleteAsyncState(this.approversId);
  public groupsApi: FBAutocompleteAsyncState = new FBAutocompleteAsyncState(this.groupsId);
  public auditApi = new FBRequest<Audit[], null>();

  public constructor({ documentId, name = "", value = [] }: FBApprovalConstructor) {
    if (!documentId) { return; }
    this.hasApproved = value;

    // post approval
    this.postApi.setTemplateUrl(FBEndpoint.PostInlineApprove, { documentId });
  }

  @computed public get approversId(): string {
    return FBAutocompleteAsyncOption.availableApprovers;
  }

  @computed public get groupsId(): string {
    return FBAutocompleteAsyncOption.groups;
  }

  @computed public get sliceData(): FBApprovalData {
    const data = FBAutocompleteAsyncStore.data;
    const approvers = data.get(FBAutocompleteAsyncOption.availableApprovers);
    const approverGroups = data.get(FBAutocompleteAsyncOption.groups);
    return {
      approvers: approvers && Array.from(approvers.values()),
      approverGroups: approverGroups && Array.from(approverGroups.values()),
    };
  }

  @computed public get isApproved(): boolean {
    return !_.isEmpty(this.hasApproved);
  }

  @action public setAuditData(data: Audit[]) {
    set(this, "auditData", data);
  }

  @action public approvers(values: string[]): Employee[] | undefined {
    return this.approversApi.sliceValue(values);
  }

  @action public groups(values: string[]): GroupRequestBody[] | undefined {
    return this.groupsApi.sliceValue(values);
  }

  @action public addApprover = (value: FBApprovalValue) => {
    set(this, "hasApproved", _.union(this.hasApproved, [value]));
  };

  @action public setApprovers = (approvers: FBApprovalValue[]) => {
    set(this, "hasApproved", approvers);
  };
}

export default FBApprovalState;
