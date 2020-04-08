import { FBInputType, FBOption } from "..";

export class FBEditorPropertiesState {
  public options: Partial<Record<FBInputType, FBOption[]>> = {
    autocomplete: [
      {
        value: "multiple",
        text: "form.builder.multi.select",
      },
    ],
    autocompleteasync: [
      {
        value: "multiple",
        text: "form.builder.multi.select",
      },
    ],
    select: [
      {
        value: "includeNone",
        text: "form.builder.include.none",
      },
      {
        value: "includeContext",
        text: "form.builder.include.other",
      },
    ],
    checkbox: [
      {
        value: "includeContext",
        text: "form.builder.include.note",
      },
    ],
    radio: [
      {
        value: "includeContext",
        text: "form.builder.include.note",
      },
    ],
    checkboxgroup: [
      {
        value: "includeContext",
        text: "form.builder.include.other",
      },
    ],
    radiogroup: [
      {
        value: "includeContext",
        text: "form.builder.include.other",
      },
    ],
  };

  public getOptions = (type?: FBInputType) => {
    if (!type) {
      return;
    }
    return this.options[type];
  };
}

export default FBEditorPropertiesState;
