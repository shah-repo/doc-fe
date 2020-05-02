import _ from "lodash";
import { FB, FBEditorPropertiesOption, FBInputType } from "..";
import { FBSchemaProps } from "../FBSchema";
import editorProperties from "./editorProperties.json";
import testStepSchema from "./testStepSchema.json";

export class FBData {
  public static get testStepSchema(): FBSchemaProps[]  {
    const compiled = _.template(JSON.stringify(testStepSchema));
    return JSON.parse(compiled({ id: FB.uniqid })) as unknown as FBSchemaProps[];
  }

  public static get editorProperties(): Partial<Record<FBInputType, FBEditorPropertiesOption[]>> {
    return editorProperties as Record<FBInputType, FBEditorPropertiesOption[]>;
  }
}

export default FBData;
