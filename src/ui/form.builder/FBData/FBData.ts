import _ from "lodash";
import { FB } from "..";
import { FBSchemaProps } from "../FBSchema";
import testStepSchema from "./testStepSchema.json";

export class FBData {
  public static get testStep(): FBSchemaProps[]  {
    const compiled = _.template(JSON.stringify(testStepSchema));
    return JSON.parse(compiled({ id: FB.uniqid })) as unknown as FBSchemaProps[];
  }
}

export default FBData;
