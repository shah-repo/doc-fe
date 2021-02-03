import { FBInputType } from "../../form.builder";

export interface SubmitFormRelation {
  type: FBInputType;
  name: string;
  prevValue: any;
  nextValue: any;
}
