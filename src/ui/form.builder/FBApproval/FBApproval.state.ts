import _ from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBApprovalData, FBApprovalValue } from ".";
import { FBAutocompleteAsyncOption } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBAutocompleteAsyncState } from "../FBAutocompleteAsync/FBAutocompleteAsync.state";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export class FBApprovalState extends FBAutocompleteAsyncState {
  @observable public hasApproved: FBApprovalValue[] = [];

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
    const data = this.sliceData.approvers;
    return _.filter(data, (approver) => _.includes(values, approver.id));
  }

  @action public groups(values: string[]): GroupRequestBody[] | undefined {
    const data = this.sliceData.approverGroups;
    return _.filter(data, (group) => _.includes(values, group.id));
  }

  @action public load = () => {
    const { approvers, approverGroups } = this.sliceData || {};
    if (this.loading) {
      return;
    }
    if (!approvers) {
      this.setOptionId(FBAutocompleteAsyncOption.approver);
      this.loadInternal();
    } else if (!approverGroups) {
      this.setOptionId(FBAutocompleteAsyncOption.group);
      this.loadInternal();
    }
  };

  @action public addApprover = (value: FBApprovalValue) => {
    set(this, "hasApproved", _.union(this.hasApproved, [value]));
  };

  @action public setApprovers = (approvers: FBApprovalValue[]) => {
    set(this, "hasApproved", approvers);
  };

  protected onSuccess() {
    super.onSuccess();
    this.load();
  }
}

export default FBApprovalState;
