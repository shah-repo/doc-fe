import { filter, get, isArray, isEmpty, isEqual, isString as lodashIsString, isUndefined, map, omit, pick, toInteger, toString, union } from "lodash";
import React from "react";
import { FB, FBButton } from "../..";
import FBTextField from "../../components/inputs/FBTextField";
import { FBFieldName } from "../../helpers/FBFieldName";
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
  approveIsBlocking,
  contextLabel,
  showContext,
  type,
  field,
  form,
  name,
  multiple,
  approved,
  ...props
}: T) => {

  const { dialogState } = FB.useStores();
  function contextState(): boolean {
    const fieldName = field?.name || "";
    const fieldValue = FBStore.getValue(fieldName);

    const isFieldValue =
        Boolean(toInteger(fieldValue)) ||
        isEqual(fieldValue, `context-${fieldName}`);
    const isFormValue = get(
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
          FBStore.setValues(omit(FBStore.getValues(), inputContextName));
        default: break;
      }
    }

    if (FBStore.mode === "form") {
      let values: Partial<FBTemplateSchema> = {
        ...FBStore.values,
        [fieldName]: value,
      };

      if (isUndefined(value) || isEmpty(toString(value))) {
        values = omit(values, fieldName);
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
    // TODO: refactoring needed
    const oldValue = FBStore.getValue(name);
    const reasonName = name + FBFieldName.ApproveReasoning;
    if (approved && !approveIsBlocking && !form?.values[reasonName]) {
      dialogState?.config({
        open: true,
        maxWidth: "md",
        content: (
          <FBTextField
            label="form.builder.change.reasoning"
            name={reasonName} />
        ),
        actions: (
          <>
            <FBButton label="common.cancel" onClick={() => {
              name && storeValue(name, oldValue);
              dialogState.closeDialog();
            }} />
            <FBButton label="common.save" onClick={() => {
              if (!FBStore.getValue(reasonName)) {
                name && storeValue(name, oldValue);
              }
              dialogState.closeDialog();
            }} />
          </>
        ),
      });
    }

    if ((!form && !field) || !name) {
      return;
    }

    if (type !== "autocomplete") {
      value = get(ev, "target.value", "");
    }

    function isChecked() {
      return get(ev.target, "checked");
    }

    function isString() {
      return toString(ev);
    }

    function isDate() {
      if (isEmpty(ev)) {
        return ev;
      }
      return (ev as unknown as Date).toISOString();
    }

    let fieldValue = {
      checkboxgroup() {
        const checked = get(ev.target, "checked");
        storeValue(value as string, checked);
        let groupValue: string[] = get(form, `values.${name}`) || [];
        groupValue = checked
          ? union(groupValue, [value as string])
          : filter(groupValue, (v) => v !== (value as string));
        storeValue(name, groupValue);

        if (isEqual(value as string, "includeContext")) {
          storeValue("contextLabel", contextLabel);
        }
      },
      checkbox: isChecked,
      radio: isChecked,
      texteditor: isString,
      datepicker: isDate,
      autocomplete() {
        const { optionValueKey = "id", optionValueType = "key", optionObjectKeys } = props;
        if (isArray(value)) {
          if (optionValueType === "object") {
            return optionObjectKeys ?
              map(value, (v) => pick(v, optionObjectKeys as string[]))
              : value;
          }
          return map(value, (v) => (lodashIsString(v) ? v : get(v, optionValueKey)));
        }
        return get(value, optionValueKey);
      },
      default() {
        return get(ev.target, "value");
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
    approveIsBlocking,
    approved,
    type,
    field,
    form,
    name,
    multiple,
  });
};
