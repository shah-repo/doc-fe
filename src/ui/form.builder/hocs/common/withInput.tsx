import _, { Dictionary } from "lodash";
import { observer, useObserver } from "mobx-react";
import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
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
    value =
      _.get(form, `values.${name}`) ||
      _.get(FBStore.getValues(), name) ||
      defaultValue ||
      _.get(FBValidatorStore.formValues, name) ||
      "";

    error = Boolean(_.get(form, `errors.${name}`));
    helperText =
      (error && _.get(form, `errors.${name}`)) ||
      FBDynamicValidatorStore.helperText[name];

    if (FBStore.mode === "form") {
      const isFieldHidden = _.isEmpty(helperText) && _.isEmpty(field?.value);
      hidden = _.includes(validationMode, "ValidationHidden") && isFieldHidden;
      disabled =
        (_.includes(validationMode, "ValidationDisabled") && isFieldHidden) ||
        disabled;
    }

    children = _.map(elements, (el) => React.cloneElement(
      el as React.ReactElement, {
        name,
        ...((type !== "autocomplete" && type !== "texteditor") && { value }),
        ...(type === "texteditor" && { defaultValue: value }),
        type,
        error,
        checked: value,
        disabled,
        ..._.pick(props, ["onChange", "afterChange"]),
      },
    ));

    return useObserver(() =>
      Component({
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
        disabled,
      }),
    );
  };

  return observer(
    withValidation(
      withFormik<any, FBTemplateSchema | Dictionary<any>>(
        withOnChange((props: T) => Comp(props)),
      ),
    ),
  );
};
