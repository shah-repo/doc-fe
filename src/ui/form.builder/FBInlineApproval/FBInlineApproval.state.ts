import { action, observable, set } from "mobx";
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBInlineApprovalOptions } from "..";

export class FBInlineApprovalState {
  @observable public options?: FBInlineApprovalOptions[];
  public approversApi = new FBAutocompleteAsyncState(this.approversId);
  public groupsApi = new FBAutocompleteAsyncState(this.groupsId);
  public rolesApi = new FBAutocompleteAsyncState(this.approvalRolesId);

  public get approversId(): string {
    return FBAutocompleteAsyncOption.availableApprovers;
  }

  public get groupsId(): string {
    return FBAutocompleteAsyncOption.groups;
  }

  public get approvalRolesId(): string {
    return FBAutocompleteAsyncOption.approvalRoles;
  }

  @action public setOptions = (options?: FBInlineApprovalOptions[]) =>
    set(this, "options", options);
}

export default FBInlineApprovalState;
