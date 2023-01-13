import { set, union } from "lodash";
import { action, observable } from "mobx";
import { ApprovalRequestGridItem } from "./ItemsAndDetails.types";

class ItemsAndDetailsState {

  constructor() {
    this.setViewItemActionsVisibility(true);
    this.setLoadingState(false);
    this.setSubmitList(false);
  }

  @observable approvalRequestItemsList: ApprovalRequestGridItem[] = [];
  @observable viewItemActionsVisible = true;
  @observable loadingState = false;
  @observable submitList = false;

  @action setApprovalRequestItemsList(list: ApprovalRequestGridItem[]) {
    set(this, "approvalRequestItemsList", list);
  }

  @action add(item: ApprovalRequestGridItem) {
    this.setApprovalRequestItemsList(union(this.approvalRequestItemsList || [], [item]));
  }

  @action setViewItemActionsVisibility(isVisible = true) {
    set(this, "viewItemActionsVisible", isVisible);
  }

  @action setLoadingState(isVisible = false) {
    set(this, "loadingState", isVisible);
  }

  @action setSubmitList(submit) {
    set(this, "submitList", submit);
  }
}

export default ItemsAndDetailsState;
