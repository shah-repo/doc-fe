import _ from "lodash";
import React from "react";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBInputProps } from "../../types/common";

export const withValidation = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    name = "",
    rules,
    label,
    placeholder,
    ...props
  }: T) => {

    const validate = (value: any) => {
      if (!rules) {
        return;
      }
      const data = {[name]: value};
      const valRules = {[name]: rules!};
      const attributes = {[name]: label as string || placeholder || name};

      const errors = FBValidatorStore.validate(data, valRules, attributes);

      if (!_.isUndefined(errors)) {
        return _.get(errors, name).join("\n");
      }
    };

    return Component({
        ...(props as T),
        name,
        label,
        placeholder,
        validate,
    });
  };
};
