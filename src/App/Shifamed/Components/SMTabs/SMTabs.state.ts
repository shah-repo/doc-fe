import { action, observable, set } from 'mobx';
import { Size } from 'react-virtualized';
import { TabChangePrompt } from './SMTabs.types';

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

  @observable public tabChangePrompt: TabChangePrompt = {
    tabId: '',
    event: undefined,
    isOpen: false,
  };

  @action public setTabChangePrompt = (tabChangePrompt: TabChangePrompt): void => {
    set(this, 'tabChangePrompt', tabChangePrompt);
  };
}
