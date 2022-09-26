import { observable, action } from "mobx";

export default class SMTabsState {
  @observable public activeTabId = "";

  @observable public isTabActive = (id: string) => this.activeTabId.toLowerCase() === id.toLowerCase();

  @action public setActiveTabId = (id: string) => {
    this.activeTabId = id;
  };
}
