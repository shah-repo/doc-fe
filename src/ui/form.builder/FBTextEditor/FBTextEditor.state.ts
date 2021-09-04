import { EditorState } from "draft-js";
import { action, observable, set } from "mobx";

class FBTextEditorState {
  // MARK: @observables
  @observable public editorState?: EditorState;
  @observable public masked?: boolean = true;

  // MARK: @config
  public editorReference?: HTMLInputElement;
  public preserveFocus = false;

  // MARK: @constructor
  public constructor(editorState: EditorState) {
    this.editorState = editorState;
  }

  // MARK: @actions
  @action public setEditorState = (editorState?: EditorState) => {
    set(this, "editorState", editorState);
  };

  @action public setMasked = (masked?: boolean) =>
    set(this, "masked", masked);

  // MARK: @helpers
  public setPreserveFocus = (state: boolean) =>
    set(this, "preserveFocus", state);
}

export default FBTextEditorState;
