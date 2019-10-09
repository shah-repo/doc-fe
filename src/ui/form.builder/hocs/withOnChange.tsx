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

    private handleChange = () => (trigger:
      | React.ChangeEvent<HTMLInputElement>
      | string
      | Date,
    ) => {
      const { form, field } = this.props;
      let value: any;

      switch (true) {
        case (trigger instanceof Date):
        case (typeof trigger === "string"):
            value = trigger;
            break;
        default:
          const target = (trigger as React.ChangeEvent<HTMLInputElement>).target;
          value = target.type === "checkbox" ? target.checked : target.value;
      }
      form.setFieldValue(field.name, value);

      if (formBuilderStore.mode === "design") { return; }
      formBuilderStore.values = {...formBuilderStore.values, [field.name as string]: value };
      formBuilderStore.submitValue();
    }
  }

  return withFormik(HOC);
}
