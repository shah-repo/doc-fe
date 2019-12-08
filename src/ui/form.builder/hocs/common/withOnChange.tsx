import _ from "lodash";
import React from "react";
import { FBFormikFieldProps } from "../../types/formik";
import FBStore from "../../stores/ui/FBStore";

export const withOnChange = <T extends FBFormikFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    onChange,
    includeContext,
    contextLabel,
    showContext,
    type,
    field,
    form,
    name,
    ...props
  }: T) => {

    showContext = field &&
      ((FBStore.mode === "form" && (field.value as boolean) && includeContext) ||
      FBStore.mode === "preview");

    const handleChange = (
      ev: React.ChangeEvent<{ value: any, checked: boolean }>,
      value: any = undefined,
    ) => {
      if ((!form && !field) || !name) {
        return;
      }

      value = _.get(ev.target, "value");
      // contextValue(value);
      switch (type) {
        case "checkboxgroup":
          const checked = _.get(ev.target, "checked");
          checked ? form!.setFieldValue(value as string, checked)
                  : form!.values = _.omit(form!.values, [value as string]);
          // context
          if (_.isEqual(value as string, "includeContext")) {
            form!.setFieldValue("contextLabel", contextLabel);
          }
          return;
        case "checkbox":
          value = _.get(ev.target, "checked");
          break;
        default:
          value = _.get(ev.target, "value");
      }
      form!.setFieldValue(name!, value);
    };

    return Component({
        ...(props as T),
        onChange: onChange || (handleChange),
        includeContext,
        showContext,
        contextLabel,
        type,
        field,
        form,
        name,
      });
    };
};
