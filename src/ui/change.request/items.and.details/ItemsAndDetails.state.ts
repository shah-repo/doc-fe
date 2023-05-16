import { set, union } from 'lodash';
import { action, observable } from 'mobx';
import { ApprovalRequestGridItem } from './ItemsAndDetails.types';

class ItemsAndDetailsState {

  constructor() {
    this.setViewItemActionsVisibility(true);
    this.setApprovalRequestItemInEditMode('');
    this.setLoadingState(false);
  }

  @observable approvalRequestItemsList: ApprovalRequestGridItem[] = [];
  @observable approvalRequstItemInEditMode = '';
  @observable viewItemActionsVisible = true;
  @observable loadingState = false;
  @observable submitList = false;

  @action setApprovalRequestItemsList(list: ApprovalRequestGridItem[]) {
    set(this, 'approvalRequestItemsList', list);
  }

  @action setApprovalRequestItemInEditMode(id: string) {
    set(this, 'approvalRequstItemInEditMode', id);
  }

  @action add(item: ApprovalRequestGridItem) {
    this.setApprovalRequestItemsList(union(this.approvalRequestItemsList || [], [item]));
  }

  @action setViewItemActionsVisibility(isVisible = true) {
    set(this, 'viewItemActionsVisible', isVisible);
  }

  @action setLoadingState(isVisible = false) {
    set(this, 'loadingState', isVisible);
  }
}

export default ItemsAndDetailsState;
