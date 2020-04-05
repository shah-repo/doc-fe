import _ from "lodash";
import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";

export const withOnChange = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => ({
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
    if (!field) {
      return;
    }
    // Context state check
    const inputContextName = `input-context-${field.name}`;

    if (includeContext) {
      switch (true) {
        case type !== "checkboxgroup" && value !== `context-${field.name}`:
        case fieldName === `context-${field.name}` && !value:
          form?.setFieldValue(inputContextName, "");
          FBStore.setValues(_.omit(FBStore.getValues(), inputContextName));
        default: break;
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
    form?.setFieldValue(fieldName, value);
    afterChange && afterChange(fieldName, value, form?.values || {});
  }

  const handleChange = (
    ev: React.ChangeEvent<{ value: any; checked: boolean }>,
    value: any = undefined,
  ) => {
    if ((!form && !field) || !name) {
      return;
    }

    if (type !== "autocomplete") {
      value = _.get(ev, "target.value", "");
    }

    function isChecked() {
      return _.get(ev.target, "checked");
    }

    function isString() {
      return _.toString(ev);
    }

    function isDate() {
      if (_.isEmpty(ev)) {
        return ev;
      }
      return (ev as unknown as Date).toISOString();
    }

    let fieldValue = {
      checkboxgroup() {
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
      },
      checkbox: isChecked,
      radio: isChecked,
      texteditor: isString,
      datepicker: isDate,
      autocomplete() {
        const { optionValueKey = "id", optionValueType = "key", optionObjectKeys } = props;
        if (_.isArray(value)) {
          if (optionValueType === "object") {
            return optionObjectKeys ?
              _.map(value, (v) => _.pick(v, optionObjectKeys as string[]))
              : value;
          }
          return _.map(value, (v) => (_.isString(v) ? v : _.get(v, optionValueKey)));
        }
        return _.get(value, optionValueKey);
      },
      default() {
        return _.get(ev.target, "value");
      },
    };

    if (type === "checkboxgroup") {
      return fieldValue.checkboxgroup();
    }
    fieldValue = fieldValue[type || ""] ? fieldValue[type || ""]() : fieldValue.default();
    storeValue(name, fieldValue);
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
