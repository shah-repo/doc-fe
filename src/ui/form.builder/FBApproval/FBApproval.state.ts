import { isEmpty, union } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalApi, FBApprovalConstructor, FBApprovalValue, FBAutocompleteAsyncOption, FBInlineApprovalRole } from "..";
import { Audit } from "../../../state/ducks/audit";
import { Employee } from "../../../state/ducks/company";
import { Document } from "../../../state/ducks/documentRevisions/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBAutocompleteAsyncState } from "../FBAutocompleteAsync/FBAutocompleteAsync.state";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

class FBApprovalState {
  @observable public hasApproved: FBApprovalValue[] = [];
  @observable public auditData?: Audit[];

  public approversValue?: string[];
  public groupsValue?: string[];
  public approvalRolesValue?: string[];

  public postApi: FBRequest<any, FBApprovalApi> = new FBRequest(FBEndpoint.PostInlineApprove);
  public getDocumentApi: FBRequest<Document, null> = new FBRequest(FBEndpoint.Document);
  public approversApi = new FBAutocompleteAsyncState(this.approversId);
  public groupsApi = new FBAutocompleteAsyncState(this.groupsId);
  public approvalRolesApi = new FBAutocompleteAsyncState(this.approvalRolesId);
  public auditApi = new FBRequest<Audit[], null>();

  public constructor({
    documentId,
    value = [],
    approversValue = [],
    groupsValue = [],
    approvalRolesValue = [],
  }: FBApprovalConstructor) {
    this.approversValue = approversValue;
    this.groupsValue = groupsValue;
    this.approvalRolesValue = approvalRolesValue;
    if (!documentId) { return; }
    this.hasApproved = value;
    this.postApi.set({ urlValues: { documentId }, url: FBEndpoint.PostInlineApprove });
  }

  public get approversId(): string {
    return FBAutocompleteAsyncOption.availableApprovers;
  }

  public get groupsId(): string {
    return FBAutocompleteAsyncOption.groups;
  }

  public get approvalRolesId(): string {
    return FBAutocompleteAsyncOption.approvalRoles;
  }

  public getDocument = (id?: string) => {
    if (!id) { return; }
    this.getDocumentApi.set({
      url: FBEndpoint.Document,
      urlValues: { id },
      method: "get",
    });
  };

  @computed public get isApproved(): boolean {
    return !isEmpty(this.hasApproved);
  }

  @computed public get approvers(): Employee[] | undefined {
    return FBAutocompleteAsyncStore.getValues<Employee>(
      this.approversId,
      this.approversValue
    );
  }

  @computed public get groups(): GroupRequestBody[] | undefined {
    return FBAutocompleteAsyncStore.getValues<GroupRequestBody>(
      this.groupsId,
      this.groupsValue
    );
  }

  @computed public get approvalRoles(): FBInlineApprovalRole[] | undefined {
    return FBAutocompleteAsyncStore.getValues<FBInlineApprovalRole>(
      this.approvalRolesId,
      this.approvalRolesValue
    );
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
