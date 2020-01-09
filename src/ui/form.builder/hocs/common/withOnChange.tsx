import _ from "lodash";
import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
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

    function contextState(): boolean {
      if (_.isUndefined(field) && _.isUndefined(form)) {
        return false;
      }

      const fieldValue =
        Boolean(_.toInteger(field!.value)) ||
        _.isEqual(field!.value, `context-${field!.name}`);
      const formValue = _.get(form!.values, `context-${field!.name}`) as boolean;
      const contextChecked: boolean = fieldValue || formValue;

      const isContextActive = (
        contextChecked && includeContext &&
        (FBStore.mode === "form" || FBStore.mode === "preview")
      );
      return isContextActive || false;
    }

    function storeValue(fieldName: string, value: any) {

      // Context state check
      const inputContextName = `input-context-${field!.name}`;

      if (includeContext) {

        switch (true) {
          case (type !== "checkboxgroup" && value !== `context-${field!.name}`):
          case (fieldName === `context-${field!.name}` && !value):
            form!.setFieldValue(inputContextName, "");
            FBStore.setValues(_.omit(FBStore.getValues(), inputContextName));
        }
      }

      if (FBStore.mode === "form") {
        let values = {
          ...FBStore.values,
          [fieldName]: value,
        };

        if (_.isUndefined(value) || _.isEmpty(_.toString(value))) {
          values = _.omit(values, fieldName);
        }

        FBStore.setValues(values);
        FBDynamicValidatorStore.validate();
      }

      form!.setFieldValue(fieldName, value);
      afterChange && afterChange(fieldName, value, form!.values || {});
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
        showContext: contextState(),
        contextLabel,
        type,
        field,
        form,
        name,
      });
    };
};
