import { isEmpty, union } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalApi, FBApprovalConstructor, FBApprovalValue } from ".";
import { FBAutocompleteAsyncOption } from "..";
import { Audit } from "../../../state/ducks/audit";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBAutocompleteAsyncState } from "../FBAutocompleteAsync/FBAutocompleteAsync.state";
import { FBApprovalRoles } from "./FBApproval.types";

export class FBApprovalState {
  @observable public hasApproved: FBApprovalValue[] = [];
  @observable public auditData?: Audit[];

  public approversValue: string[] = [];
  public groupsValue: string[] = [];
  public approvalRolesValue: string[] = [];

  public postApi: FBRequest<any, FBApprovalApi> = new FBRequest();
  public approversApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.availableApprovers);
  public groupsApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.groups);
  public approvalRolesApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.approvalRoles);
  public auditApi = new FBRequest<Audit[], null>();

  public constructor({ 
    documentId, 
    value = [], 
    approversValue = [], 
    groupsValue = [], 
    approvalRolesValue = [] 
  }: FBApprovalConstructor) {

    this.approversValue = approversValue;
    this.groupsValue = groupsValue;
    this.approvalRolesValue = approvalRolesValue;
    if (!documentId) { return; }
    this.hasApproved = value;
    // post approval
    this.postApi.setTemplateUrl(FBEndpoint.PostInlineApprove, { documentId });
  }

  public get approvalRolesId(): string {
    return FBAutocompleteAsyncOption.approvalRoles;
  }

  @computed public get isApproved(): boolean {
    return !isEmpty(this.hasApproved);
  }

  @computed public get approvers(): Employee[] | undefined {
    return this.approversApi.sliceValue(this.approversValue);
  }

  @computed public get groups(): GroupRequestBody[] | undefined {
    return this.groupsApi.sliceValue(this.groupsValue);
  }

  @computed public get approvalRoles(): FBApprovalRoles[] | undefined {
    return this.approvalRolesApi.sliceValue(this.approvalRolesValue);
  }

  @action public setAuditData(data: Audit[]) {
    set(this, "auditData", data);
  }

  @action public addApprover = (value: FBApprovalValue) => {
    set(this, "hasApproved", union(this.hasApproved, [value]));
  };

  @action public setApprovers = (approvers: FBApprovalValue[]) => {
    set(this, "hasApproved", approvers);
  };
}

export default FBApprovalState;
