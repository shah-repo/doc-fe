import React from "react";
import { withFormik } from "../../../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../../../components/hoc/utils/types";
import { FBOnChangeProps, Subtract } from "../utils/types";

export function withElOnChange<T extends FBOnChangeProps & FormikHybridFieldProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBOnChangeProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          onChange={this.handleChange()}
          value={this.props.field.value}
        />
      );
    }

    private handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { form, field } = this.props;
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      form.setFieldValue(field.name, value);
    }
  }

  return withFormik(HOC);
}
