import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { action, observable, set } from "mobx";

export class FBTextEditorState {
  @observable public editorState?: EditorState;

  public constructor(formValue?: string) {
    if (!formValue) {
      this.editorState = EditorState.createEmpty();
      return;
    }
    const contentBlock = htmlToDraft(formValue);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    this.editorState = EditorState.createWithContent(contentState);
  }

  @action public setEditorState = (editorState?: EditorState) => {
    set(this, "editorState", editorState);
  };

}

export default FBTextEditorState;
