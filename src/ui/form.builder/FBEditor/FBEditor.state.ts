import { action, observable, set } from "mobx";
import React from "react";
import { FBEditorMode, FBEditorModeProps, FBEditorProps, FBInputType } from "..";
import { FBEditorAutocomplete } from "../FBEditorAutocomplete";
import { FBEditorCheckControl } from "../FBEditorCheckControl";
import { FBEditorHyperlink } from "../FBEditorHyperlink";
import { FBEditorLabel } from "../FBEditorLabel";
import { FBEditorOptionGroup } from "../FBEditorOptionGroup";
import { FBEditorTextField } from "../FBEditorTextField";


export class FBEditorState {

  public static omitValidation: FBInputType[] = [
    "section",
    "subsection",
    "hyperlink",
    "action",
  ];

  private static editors: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    section: FBEditorLabel,
    subsection: FBEditorLabel,
    textfield: FBEditorTextField,
    checkbox: FBEditorCheckControl,
    checkboxgroup: FBEditorOptionGroup,
    autocomplete: FBEditorAutocomplete,
    texteditor: FBEditorLabel,
    datepicker: FBEditorLabel,
    hyperlink: FBEditorHyperlink,
    select: FBEditorOptionGroup,
    // radio: FBEditorCheckControl,
    // radiogroup: FBEditorOptionGroup,
    // fileupload: FBEditorLabel,
    // autocomplete: FBEditorAutocomplete,
    // autocompleteasync: FBEditorAutocomplete,
  };

  @observable public mode?: FBEditorMode = "config";
  public modeConfig: FBEditorModeProps[] = [
    {
      mode: "config",
      label: "form.builder.field.config",
    },
    {
      mode: "validation",
      label: "form.builder.validation",
    },
  ];

  public static editor = (editorProps: FBEditorProps): React.ReactElement | undefined => {
    const { type, index } = editorProps;
    const editorControl = FBEditorState.editors[type || ""];
    if (!editorControl) {
      return;
    }
    return React.createElement(editorControl, {
      key: `fb-editor-${type}-${index}`,
      ...editorProps,
    });
  };

  @action public setMode = (mode: FBEditorMode) => set(this, "mode", mode);
}

export default FBEditorState;
