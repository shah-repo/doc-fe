import _ from "lodash";
import { FB, FBAutocompleteAsyncConfig, FBEditorPropertiesOption, FBInputType, FBOption } from "..";
import { FBSchemaProps } from "../FBSchema";
import autocompleteOptions from "./autocompleteOptions.json";
import editorProperties from "./editorProperties.json";
import requirementOptions from "./requirementOptions.json";
import testStepSchema from "./testStepSchema.json";
import unitsOptions from "./unitsOptions.json";

export class FBData {
  public static get testStepSchema(): FBSchemaProps[]  {
    const compiled = _.template(JSON.stringify(testStepSchema));
    return JSON.parse(compiled({ id: FB.uniqid })) as unknown as FBSchemaProps[];
  }

  public static get editorProperties(): Partial<Record<FBInputType, FBEditorPropertiesOption[]>> {
    return editorProperties as Record<FBInputType, FBEditorPropertiesOption[]>;
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
}

export default FBData;
