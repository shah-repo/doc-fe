import { action, observable, set } from "mobx";
import { DocumentRevisionLeftPanelStateProps } from "../../../../..";

export default class DocumentRevisionLeftPanelState implements DocumentRevisionLeftPanelStateProps {

  // MARK: @config

  // MARK: @observables
  @observable public open = true;
  @observable public title = "";

  // MARK: @api

  // MARK: @constructor

  // MARK: @computed

  // MARK: @actions
  @action setOpen = () => set(this, "open", !this.open);
  @action setTitle = (title: string) => set(this, "title", title);

  // MARK: @helpers

}
