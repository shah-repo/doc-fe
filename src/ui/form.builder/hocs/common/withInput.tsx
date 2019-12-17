import { Dictionary } from "lodash";
import _ from "lodash";
import React from "react";
import { FBFormValues } from "../../defaults/formik";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";
import { withFormik } from "./withFormik";
import { withOnChange } from "./withOnChange";
import { withValidation } from "./withValidation";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
// import FBStore from "../../stores/ui/FBStore";

export const withInput = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    form,
    field,
    name = "",
    type = "",
    children,
    value,
    defaultValue,
    error,
    helperText,
    ...props
  }: T) => {

    const elements = React.Children.toArray(children);
    value = _.get(form, `values.${name}`);

    if (_.isUndefined(value)) {
      // value = _.get(form, `values.formInput.${name}`) || defaultValue || _.get(FBFormValues, type);
      value = defaultValue || _.get(FBFormValues, type);
    }

    error = Boolean(_.get(form, `errors.${name}`));
    helperText = (error && _.get(form, `errors.${name}`)) || FBValidatorStore.getErrorText(name);

    if (elements.length === 1) {
      _.first(elements) && (
        children = React.cloneElement(_.first(elements) as React.ReactElement, {
          name,
          value,
          type,
          error,
          checked: value,
          ..._.pick(props, ["disabled", "onChange", "afterChange"]),
        })
      );
    }

    return Component({
      ...(props as T),
      value,
      form,
      name,
      type,
      children,
      error,
      helperText,
    });
  };

  return (
    withValidation(
    withFormik<any, FBTemplateSchema | Dictionary<any>>(
    withOnChange(
      (props: T) => Comp(props)),
  )));
};
