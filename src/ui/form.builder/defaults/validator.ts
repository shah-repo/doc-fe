import _ from "lodash";
import Validator from "validatorjs";
import { SelectOption } from "../../components/forms/fields/Select";
import FBStore from "../stores/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBValidatorTrigger } from "../types/validation/validator";

export const validatorTriggers = (): SelectOption[] => {
  return _.map(
    FBValidatorTrigger,
    (v, k) => ({ value: k, text: v } as SelectOption),
  );
};

export const FBValidate = () => {
  if (FBStore.mode !== "form") {
    return;
  }
  const rules = FBValidatorStore.getSchemaRules();
  if (!rules) {
    return;
  }

  const validator = new Validator(
      FBStore.getValues(),
      rules,
  );

  validator.setAttributeNames(
    FBValidatorStore.getValidatorNames(),
  );

  validator.fails(() => {
    const errors = validator.errors.all();

    _.map(errors, (v: string, k: string) =>
      FBValidatorStore.errors[k] = _.values(v).join("\n"),
    );
  });

  validator.passes(() => {
    FBValidatorStore.errors = {};
  });
};
