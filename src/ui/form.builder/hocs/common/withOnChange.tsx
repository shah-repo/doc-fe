import _ from "lodash";
import React from "react";
import FBStore from "../../stores/ui/FBStore";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBInputProps } from "../../types/common";

export const withOnChange = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    onChange,
    afterChange,
    includeContext = false,
    contextLabel,
    showContext,
    type,
    field,
    form,
    name,
    ...props
  }: T) => {

    function contextValue(): boolean {
      if (!field && !form) {
        return false;
      }

      const fieldValue =
        Boolean(_.toInteger(field!.value)) ||
        _.isEqual(field!.value, `other-${field!.name}`);
      const formValue = _.get(form!.values, `other-${field!.name}`) as boolean;
      const contextChecked: boolean = fieldValue || formValue;

      return (
        contextChecked && includeContext &&
        (FBStore.mode === "form" || FBStore.mode === "preview")
      );
    }

    function storeValue(fieldName: string, value: any) {
      form!.setFieldValue(fieldName, value);
      afterChange && afterChange(fieldName, value, form!.values || {});
      if (FBStore.mode !== "form") {
        return;
      }
      FBStore.setValues({
        ...FBStore.values,
        [fieldName]: value,
      });

      FBValidatorStore.customValidate();
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
          storeValue(value as string, checked);
          if (_.isEqual(value as string, "includeContext")) {
            storeValue("contextLabel", contextLabel);
          }
          return;
        case "checkbox":
        case "radio":
          value = _.get(ev.target, "checked");
          break;
        case "texteditor":
        case "datepicker":
          value = ev as unknown as string;
          break;
        default:
          value = _.get(ev.target, "value");
      }
      storeValue(name!, value);
    };

    return Component({
        ...(props as T),
        onChange: onChange || (handleChange),
        afterChange,
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
