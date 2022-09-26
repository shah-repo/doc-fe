import { observable, action } from "mobx";

export default class SMTabsState {
  @observable public activeTabId: string | null = null;

  @action public setActiveTabId = (id: string) => {
    this.activeTabId = id;
  };
}
