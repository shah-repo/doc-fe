import { observable, action } from "mobx";

type TabId = string | undefined;

export default class SMTabsState {
  @observable public activeTabId: TabId;

  @observable public isTabActive = (id: TabId) => String(this.activeTabId).toLowerCase() === String(id).toLowerCase();

  @action public setActiveTabId = (id: TabId) => {
    this.activeTabId = id;
  };
}
