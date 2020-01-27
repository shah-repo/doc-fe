import { Dictionary } from "lodash";
import _ from "lodash";
import { observer, useObserver } from "mobx-react";
import React from "react";
import { FBFormValues } from "../../defaults/formik";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";
import { withFormik } from "./withFormik";
import { withOnChange } from "./withOnChange";
import { withValidation } from "./withValidation";

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
    validationMode,
    hidden = false,
    disabled,
    ...props
  }: T) => {

    const elements = React.Children.toArray(children);
    value = _.get(form, `values.${name}`);

    _.isUndefined(value) && (value =
      _.get(FBStore.getValues(), name) || defaultValue || _.get(FBFormValues, type)
    );
    error = Boolean(_.get(form, `errors.${name}`));
    helperText = (
      (error && _.get(form, `errors.${name}`)) ||
      FBDynamicValidatorStore.helperText[name]
    );

    if (FBStore.mode === "form") {
      const isFieldHidden = _.isEmpty(helperText) && _.isEmpty(field?.value);
      hidden = (_.includes(validationMode, "ValidationHidden") && isFieldHidden);
      disabled = (_.includes(validationMode, "ValidationDisabled") && isFieldHidden);
    }

    if (elements.length === 1) {
      _.first(elements) && (
        children = React.cloneElement(_.first(elements) as React.ReactElement, {
          name,
          value,
          type,
          error,
          checked: value,
          disabled,
          ..._.pick(props, ["onChange", "afterChange"]),
        })
      );
    }

    return useObserver(() => Component({
      ...(props as T),
      value,
      form,
      name,
      type,
      children,
      error,
      helperText: FBDynamicValidatorStore.helperText[name],
      validationMode,
      hidden,
    }));
  };

  return (
    observer(
    withValidation(
    withFormik<any, FBTemplateSchema | Dictionary<any>>(
    withOnChange(
      (props: T) => Comp(props)),
  ))));
};
