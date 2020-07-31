import { Model } from "mobx-rest";
import { FBValidatorIndicatorProps } from "../../../types/validation/validator";

export class FBActionModel extends Model {
  public name?: string = "";
  public actionLabel?: string = "";
  public description?: string;
  public requestUrl?: string;
  public requestMethod?: string;
  public indicators?: Partial<FBValidatorIndicatorProps>[];
  public docIdRequired?: boolean;
  public payload?: any;
}
