import { Dictionary, get, includes, isEmpty, map, pick } from "lodash";
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
      get(form, `values.${name}`) ||
      get(FBStore.getValues(), name) ||
      defaultValue ||
      get(FBValidatorStore.formValues, name) ||
      "";

    error = Boolean(get(form, `errors.${name}`));
    helperText =
      (error && get(form, `errors.${name}`)) ||
      FBDynamicValidatorStore.helperText[name];

    if (FBStore.mode === "form") {
      const isFieldHidden = isEmpty(helperText) && isEmpty(field?.value);
      hidden = includes(validationMode, "ValidationHidden") && isFieldHidden;
      disabled =
        (includes(validationMode, "ValidationDisabled") && isFieldHidden) ||
        disabled;
    }

    children = map(elements, (el) => React.cloneElement(
      el as React.ReactElement, {
        name,
        ...((type !== "autocomplete" && type !== "texteditor") && { value }),
        ...(type === "texteditor" && { defaultValue: value }),
        type,
        error,
        checked: value,
        disabled,
        ...pick(props, ["onChange", "afterChange"]),
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
