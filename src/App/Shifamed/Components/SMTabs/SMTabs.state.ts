import { action, observable } from 'mobx';
import { Size } from 'react-virtualized';

export default class SMTabsState {
  @observable public activeTabId = '';
  @observable public contentSize?: Size;

  @action public setActiveTabId = (id: string): void => {
    this.activeTabId = id;
  };

  @observable public isTabActive = (id: string): boolean => {
    return this.activeTabId.toLowerCase() === id.toLowerCase();
  };

  @action public setContentSize = (size: Size): void => {
    this.contentSize = size;
  };
}
