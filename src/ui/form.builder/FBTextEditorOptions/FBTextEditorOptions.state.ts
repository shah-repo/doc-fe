import { action, observable, set } from "mobx";

export class FBTextEditorOptionsState {
  // MARK: @observables
  @observable public menuVisible?: boolean = false;

  // MARK: @config
  public menuAnchorElement?: HTMLElement;

  // MARK: @actions
  @action public setMenuVisible = (visible: boolean) =>
    set(this, "menuVisible", visible);

  // MARK: @helpers
  public setAnchorElement = (el?: HTMLElement) =>
    set(this, "menuAnchorElement", el);
}

export default FBTextEditorOptionsState;
