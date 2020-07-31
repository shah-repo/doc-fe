import _ from "lodash";
import Validator from "validatorjs";
import FBStore from "../stores/ui/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";

export const FBValidate = (forRelease = false) => {
  if (FBStore.mode !== "form") {
    return;
  }
  const rules = forRelease ? FBValidatorStore.getSchemaReleasedRules() : FBValidatorStore.getSchemaRules();
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
