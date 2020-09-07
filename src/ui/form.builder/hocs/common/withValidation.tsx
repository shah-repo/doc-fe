
import React from "react";
import { FBInputProps } from "../../types/common";

export const withValidation = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => ({
  name = "",
  rules,
  label,
  placeholder,
  applicableOn,
  ...props
}: T) => {
  const validate = (value: any) => {
    // if (!rules || !_.isEmpty(applicableOn)) {
    //   return;
    // }
    // const data = {[name]: value};
    // const valRules = {[name]: rules!};
    // const attributes = {[name]: label as string || placeholder || name};
    // const errors = FBValidatorStore.validate(data, valRules, attributes);
    // if (!_.isUndefined(errors) && !_.isEmpty(errors)) {
    //   return _.get(errors, name).join("\n");
    // }
  };

  return Component({
    ...(props as T),
    name,
    label,
    placeholder,
    validate,
  });
};
