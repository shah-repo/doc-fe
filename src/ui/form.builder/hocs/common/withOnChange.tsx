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
    setContext,
    ...props
  }: T) => {
    const { field, form, name } = props;

    function checkOptions(value: any): any {
      if (_.has(value, "props")) {
        return value.props.value;
      }
      return value;
    }

    function chekcboxGroupValue(fieldName: string, value: boolean): boolean {
      if (props.type !== "checkboxgroup" || !form) {
        return false;
      }
      if (value) {
        form.setFieldValue(fieldName!, value);
      } else {
        form.values = _.omit(form.values, [fieldName]);
      }
      return true;
    }

    function contextValue(value: boolean) {
      if (!setContext) {
        return;
      }
      const showContext =
        (FBStore.mode === "form" && (value as boolean) && includeContext) ||
        FBStore.mode === "preview";
      setContext(showContext);
    }

    const handleChange = (
      ev: React.ChangeEvent<{ value: any, checked: boolean }>,
      value: any = undefined,
    ) => {
      if ((!form && !field) || !name) {
        return;
      }
      value = (!_.isUndefined(value)) ? checkOptions(value) : (ev.target.value || ev.target.checked);
      contextValue(value);
      if (!chekcboxGroupValue(value as string, ev.target.checked)) {
        form!.setFieldValue(name!, value);
      }
    };

    return Component({
        ...(props as T),
        onChange: onChange || (handleChange),
        includeContext,
        setContext,
      });
    };
};
