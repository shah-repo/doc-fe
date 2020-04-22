import _ from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalApi, FBApprovalData, FBApprovalValue } from ".";
import { FBAutocompleteAsyncOption } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBAutocompleteAsyncState } from "../FBAutocompleteAsync/FBAutocompleteAsync.state";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
import FBStore from "../stores/ui/FBStore";

export class FBApprovalState {
  @observable public hasApproved: FBApprovalValue[] = [];
  public postApi: FBRequest<any, FBApprovalApi> = new FBRequest();
  public approversApi: FBAutocompleteAsyncState = new FBAutocompleteAsyncState(this.approversId);
  public groupsApi: FBAutocompleteAsyncState = new FBAutocompleteAsyncState(this.groupsId);

  public constructor() {
    const urlTpl = _.template(FBEndpoint.PostInlineApprove);
    const url = urlTpl({ documentId: FBStore.docId });
    this.postApi.setUrl(url);
  }

  @computed public get approversId(): string {
    return FBAutocompleteAsyncOption.approver;
  }

  @computed public get groupsId(): string {
    return FBAutocompleteAsyncOption.group;
  }

  @computed public get sliceData(): FBApprovalData {
    const data = FBAutocompleteAsyncStore.data;
    const approvers = data.get(FBAutocompleteAsyncOption.approver);
    const approverGroups = data.get(FBAutocompleteAsyncOption.group);
    return {
      approvers: approvers && Array.from(approvers.values()),
      approverGroups: approverGroups && Array.from(approverGroups.values()),
    };
  }

  @computed public get isApproved(): boolean {
    return !_.isEmpty(this.hasApproved);
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
