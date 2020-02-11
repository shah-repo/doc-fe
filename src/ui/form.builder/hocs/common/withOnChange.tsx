import _ from "lodash";
import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";

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
    multiple,
    ...props
  }: T) => {
    function contextState(): boolean {
      if (_.isUndefined(field) && _.isUndefined(form)) {
        return false;
      }
      const fieldName = field?.name || "";
      const fieldValue = FBStore.getValue(fieldName);

      const isFieldValue =
        Boolean(_.toInteger(fieldValue)) ||
        _.isEqual(fieldValue, `context-${fieldName}`);
      const isFormValue = _.get(
        FBStore.getValues(),
        `context-${fieldName}`,
      ) as boolean;
      const contextChecked: boolean = isFieldValue || isFormValue;

      const isContextActive =
        contextChecked &&
        includeContext &&
        (FBStore.mode === "form" || FBStore.mode === "preview");
      return isContextActive || false;
    }

    function storeValue(fieldName: string, value: any) {
      // Context state check
      const inputContextName = `input-context-${field!.name}`;

      if (includeContext) {
        switch (true) {
          case type !== "checkboxgroup" && value !== `context-${field!.name}`:
          case fieldName === `context-${field!.name}` && !value:
            form!.setFieldValue(inputContextName, "");
            FBStore.setValues(_.omit(FBStore.getValues(), inputContextName));
        }
      }

      if (FBStore.mode === "form") {
        let values: Partial<FBTemplateSchema> = {
          ...FBStore.values,
          [fieldName]: value,
        };

        if (_.isUndefined(value) || _.isEmpty(_.toString(value))) {
          values = _.omit(values, fieldName);
        }

        FBStore.setValues(values);
      }

      FBDynamicValidatorStore.validate();

      if (type !== "texteditor") {
        form!.setFieldValue(fieldName, value);
        afterChange && afterChange(fieldName, value, form!.values || {});
      }
    }

    const handleChange = (
      ev: React.ChangeEvent<{ value: any; checked: boolean }>,
      value: any = undefined,
    ) => {
      if ((!form && !field) || !name) {
        return;
      }

      if (type !== "autocomplete") {
        value = _.get(ev.target, "value");
      }

      switch (type) {
        case "checkboxgroup":
          const checked = _.get(ev.target, "checked");
          storeValue(value as string, checked);
          let groupValue: string[] = _.get(form, `values.${name}`) || [];
          groupValue = checked
            ? _.union(groupValue, [value as string])
            : _.filter(groupValue, (v) => v !== (value as string));
          storeValue(name, groupValue);

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
          value = (ev as unknown) as string;
          break;
        case "autocomplete":
          if (_.isArray(value)) {
            value = _.map(value, (v) => (_.isString(v) ? v : v.id));
          } else {
            value = _.get(value, "id");
          }
          break;
        // case "select":
        //   if (multiple) {
        //     const selectValue: string[] = _.get(form, `values.${name}`) as string[] || [];
        //     value = selectValue.push(_.get(ev.target, "value"));
        //     // value = _.get(ev.target, "value") as string[];
        //     break;
        //   }
        default:
          value = _.get(ev.target, "value");
      }
      storeValue(name!, value);
    };

    return Component({
      ...(props as T),
      onChange: onChange || handleChange,
      afterChange,
      includeContext,
      showContext: contextState(),
      contextLabel,
      type,
      field,
      form,
      name,
      multiple,
    });
  };
};
