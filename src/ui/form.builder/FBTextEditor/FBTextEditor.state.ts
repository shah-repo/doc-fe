import { EditorState } from "draft-js";
import { action, observable, set } from "mobx";

export class FBTextEditorState {
  @observable public editorState?: EditorState;

  public constructor(formValue: EditorState) {
    this.editorState = formValue;
  }

  @action public setEditorState = (editorState?: EditorState) => {
    set(this, "editorState", editorState);
  };
}

export default FBTextEditorState;
