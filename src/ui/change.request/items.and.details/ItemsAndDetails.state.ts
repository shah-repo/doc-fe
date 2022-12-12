import { set, union } from "lodash";
import { action, observable } from "mobx";
import { createContext, useContext } from "react";
import { ChangeOrderGridItem } from "./ItemsAndDetails.types";

class ItemsAndDetailsStore {
  @observable changeOrderItemsList: ChangeOrderGridItem[] = [];
  @observable viewItemActionsVisible = true;
  @observable loadingState = false;

  @action setChangeOrderItemsList(list: ChangeOrderGridItem[]) {
    set(this, "changeOrderItemsList", list);
  }

  @action add(item: ChangeOrderGridItem) {
    this.setChangeOrderItemsList(union(this.changeOrderItemsList || [], [item]));
  }

  @action setViewItemActionsVisibility(isVisible = true) {
    set(this, "viewItemActionsVisible", isVisible);
  }

  @action setLoadingState(isVisible = false) {
    set(this, "loadingState", isVisible);
  }
}


export const itemsAndDetailsStore = {
  itemsAndDetailsStore: new ItemsAndDetailsStore(),
};

export const ItemsAndDetailsStoreContext = createContext(itemsAndDetailsStore);
export const useItemsAndDetailsStore = () => useContext(ItemsAndDetailsStoreContext);
