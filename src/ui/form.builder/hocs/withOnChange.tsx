import React from "react";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { formBuilderStore } from "../stores/FBStore";
import { FBOnChangeProps, Subtract } from "../types/common";

export function withOnChange<T extends FBOnChangeProps & FormikHybridFieldProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBOnChangeProps>> {

    public render() {
      const { field } = this.props;
      return (
        <Component
          {...this.props as T}
          onChange={this.handleChange()}
          value={field.value && field.value || null}
        />
      );
    }

    private handleChange = () => (trigger: React.ChangeEvent<HTMLInputElement> | Date) => {
      const { form, field } = this.props;
      let value: string | number | boolean | Date;
      if (trigger instanceof Date) {
        value = trigger;
      } else {
        const target = trigger.target;
        value = target.type === "checkbox" ? target.checked : target.value;
      }
      form.setFieldValue(field.name, value);
      formBuilderStore.values = form.values;
    }
  }

  return withFormik(HOC);
}
