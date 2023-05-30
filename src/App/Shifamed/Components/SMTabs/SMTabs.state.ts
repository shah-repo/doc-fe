import { observable, action } from 'mobx';

export default class SMTabsState {
  @observable public activeTabId = '';

  @action public setActiveTabId = (id: string): void => {
    this.activeTabId = id;
  };

  @observable public isTabActive = (id: string): boolean => {
    return this.activeTabId.toLowerCase() === id.toLowerCase();
  };
}
