import { set, union } from 'lodash';
import { action, observable } from 'mobx';
import { ApprovalRequestGridItem } from './ItemsAndDetails.types';

class ItemsAndDetailsState {
  @observable approvalRequestItemsList: ApprovalRequestGridItem[] = [];
  @observable approvalRequstItemInEditMode = '';
  @observable viewItemActionsVisible = true;
  @observable loadingState = false;
  @observable submitList = false;

  @action setApprovalRequestItemsList (list: ApprovalRequestGridItem[]): void {
    set(this, 'approvalRequestItemsList', list);
  }

  @action setApprovalRequestItemInEditMode (id: string): void {
    set(this, 'approvalRequstItemInEditMode', id);
  }

  @action add (item: ApprovalRequestGridItem): void {
    this.setApprovalRequestItemsList(union(this.approvalRequestItemsList || [], [item]));
  }

  @action setViewItemActionsVisibility (isVisible = true): void {
    set(this, 'viewItemActionsVisible', isVisible);
  }

  @action setLoadingState (isVisible = false): void {
    set(this, 'loadingState', isVisible);
  }
}

export default ItemsAndDetailsState;
