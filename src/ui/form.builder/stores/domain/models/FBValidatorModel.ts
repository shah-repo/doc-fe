import { Model } from "mobx-rest";
import { FBValidatorIndicatorProps } from "../../../types/validation/validator";

export class FBValidatorModel extends Model {
  public name?: string = "";
  public pattern?: string;
  public description?: string = "";
  public applicableIn?: string[];
  public indicators?: Partial<FBValidatorIndicatorProps>[];
}
