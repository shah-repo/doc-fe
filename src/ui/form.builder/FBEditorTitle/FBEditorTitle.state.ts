import { FBEditorModeProps } from "..";

class FBEditorTitleState {
  public static modeConfig: FBEditorModeProps[] = [
    {
      mode: "config",
      label: "form.builder.field.config",
    },
    {
      mode: "validation",
      label: "form.builder.validation",
    },
  ];
}

// TODO: Remove this in 22.3 as new component created for this
FBEditorTitleState;
