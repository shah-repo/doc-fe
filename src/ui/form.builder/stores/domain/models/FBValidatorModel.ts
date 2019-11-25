import { Model } from "mobx-rest";
import { FBTemplateSchema } from "../../../types/store";

export class FBValidatorModel extends Model {
  public name: string = "";
  public pattern?: string;
  public description?: string = "";
  public applicableIn?: string;
  public indicators?: Array<Partial<FBTemplateSchema>>;
}
