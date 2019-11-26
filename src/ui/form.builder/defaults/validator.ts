import _ from "lodash";
import { SelectOption } from "../../components/forms/fields/Select";
import { FBValidatorTrigger } from "../types/validation/validator";

export const validatorTriggers = (): SelectOption[] => {
  return _.map(
    FBValidatorTrigger,
    (v, k) => ({ value: k, text: v } as SelectOption),
  );
};
