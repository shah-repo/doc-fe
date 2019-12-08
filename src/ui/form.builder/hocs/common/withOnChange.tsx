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

    function contextValue(): boolean {
      const contextChecked: boolean = field && form &&
        ((field.value as boolean) || _.get(form.values, `other-${field.name}`));
      
      return ((FBStore.mode === "form" && contextChecked && includeContext) ||
              FBStore.mode === "preview");
    }

    const handleChange = (
      ev: React.ChangeEvent<{ value: any, checked: boolean }>,
      value: any = undefined,
    ) => {
      if ((!form && !field) || !name) {
        return;
      }

      value = _.get(ev.target, "value");

      switch (type) {
        case "checkboxgroup":
          const checked = _.get(ev.target, "checked");
          form!.setFieldValue(value as string, checked)
          if (_.isEqual(value as string, "includeContext")) {
            form!.setFieldValue("contextLabel", contextLabel);
          }
          return;
        case "checkbox":
          value = _.get(ev.target, "checked");
          break;
        case "texteditor":
        case "datepicker":
          value = ev as unknown as string;
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
        showContext: contextValue(),
        contextLabel,
        type,
        field,
        form,
        name,
      });
    };
};
