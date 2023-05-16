import { action, observable, set } from 'mobx';
import { SMDialogStateProps } from '../../..';

export default class SMDialogState implements SMDialogStateProps {

  // MARK: @config

  // MARK: @observables
  @observable public isOpen = false;

  // MARK: @constructor

  // MARK: @computed

  // MARK: @actions
  @action public setOpen = (isOpen: boolean) => set(this, 'isOpen', isOpen);
}
