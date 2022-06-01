import { EditorState } from "draft-js";
import { action, observable, set } from "mobx";
import { SMTextEditorStateProps } from "../../..";

export default class SMTextEditorState implements SMTextEditorStateProps {

  // MARK: @config
  public editorReference?: HTMLInputElement;

  // MARK: @observables
  @observable public editorState?: EditorState;
  @observable public masked?: boolean = true;

  // MARK: @api

  // MARK: @constructor

  // MARK: @computed

  // MARK: @actions
  @action public setEditorState = (editorState?: EditorState) => {
    set(this, "editorState", editorState);
  };

  @action public setMasked = (masked?: boolean) =>
    set(this, "masked", masked);

  // MARK: @helpers
}
