import { action, observable, set } from "mobx";
import { DocumentRevisionSidebarStateProps } from "../../../../..";

export default class DocumentRevisionSidebarState implements DocumentRevisionSidebarStateProps {

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
