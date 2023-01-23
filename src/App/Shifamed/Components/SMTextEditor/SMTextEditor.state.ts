import { EditorState } from "draft-js";
import { action, observable, set } from "mobx";
import { SMTextEditorStateProps } from "../../..";

export default class SMTextEditorState implements SMTextEditorStateProps {

  // MARK: @config
  public editorReference?: any;

  // MARK: @observables
  @observable public editorState?: EditorState;
  @observable public masked?: boolean = true;
  @observable public previewMode?: boolean = true;

  // MARK: @api

  // MARK: @constructor

  // MARK: @computed

  // MARK: @actions
  @action public setEditorState = (editorState?: EditorState) => {
    set(this, "editorState", editorState);
  };

  @action public setMasked = (masked?: boolean) =>
    set(this, "masked", masked);

  @action public setPreviewMode = (previewMode?: boolean) =>
    set(this, "previewMode", previewMode);

  @action public togglePreviewMode = () =>
    this.setPreviewMode(!this.previewMode);

  // MARK: @helpers
}
