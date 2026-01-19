import { action, computed, observable } from 'mobx';
import { Size } from 'react-virtualized';

export default class SMTabsState {
  @observable public activeTabId = '';
  @observable public contentSize?: Size;
  @observable restrictTabClick = false;

  @computed get isTabClickAllowed (): boolean {
    return !this.restrictTabClick;
  }

  @action public setActiveTabId = (id: string): void => {
    if (!this.isTabClickAllowed) {
      return;
    }

    this.activeTabId = id;
  };

  @observable public isTabActive = (id: string): boolean => {
    return this.activeTabId.toLowerCase() === id.toLowerCase();
  };

  @action public setContentSize = (size: Size): void => {
    this.contentSize = size;
  };

  @action setTabClickRestriction = (restricted: boolean): void => {
    this.restrictTabClick = restricted;
  };
}
