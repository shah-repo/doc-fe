import _ from "lodash";
import { FB, FBAutocompleteAsyncConfig, FBEditorPropertiesOption, FBEditorPropertiesType, FBInputType, FBOption, FBSchemaProps } from "..";
import additionalSchema from "./additionalSchema.json";
import autocompleteOptions from "./autocompleteOptions.json";
import editorProperties from "./editorProperties.json";
import editorPropertiesControl from "./editorPropertiesControl.json";
import requirementOptions from "./requirementOptions.json";
import testStepSchema from "./testStepSchema.json";
import unitsOptions from "./unitsOptions.json";

export class FBData {
  public static get testStepSchema(): FBSchemaProps[]  {
    const compiled = _.template(JSON.stringify(testStepSchema));
    return JSON.parse(compiled({ id: FB.uniqid })) as unknown as FBSchemaProps[];
  }

  public static get editorProperties(): Record<FBEditorPropertiesType, FBEditorPropertiesOption> {
    return editorProperties;
  }

  public static get editorPropertiesControl(): Record<FBInputType, FBEditorPropertiesType[]> {
    return editorPropertiesControl as Record<FBInputType, FBEditorPropertiesType[]>;
  }

  public static editorPropertiesByType(type: FBInputType): FBEditorPropertiesOption[] | undefined {
    const editorProps = FBData.editorPropertiesControl[type];
    if (!editorProps) { return; }
    return _.map(editorProps, (itm) => ({
      value: itm,
      ...FBData.editorProperties[itm],
      // :/
      ...(itm === "includeContext" && (type === "checkbox" || type === "radio")) && {
        text: "form.builder.include.note",
      },
    })) as FBEditorPropertiesOption[];
  }

  public static get autocompleteOptions(): FBAutocompleteAsyncConfig[] {
    return autocompleteOptions;
  }

  public static get unitsOptions(): FBOption[] {
    return unitsOptions;
  }

  public static get requirementOptions(): FBOption[] {
    return requirementOptions;
  }

  public static additionalSchema(type: FBInputType): Partial<FBSchemaProps>[] {
    const compiled = _.template(JSON.stringify(additionalSchema));
    const parse = JSON.parse(compiled({ id: FB.uniqid }));
    return parse[type];
  }
}

export default FBData;
