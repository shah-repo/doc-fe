import React from "react";
import { withFormik } from "../../../../../components/hoc/formik";
import { Subtract } from "../../../common/utils/types";
import { FBTextFieldInjectedProps, FBTextFieldProps } from "./types";

export function withTextFieldDefaults<T extends FBTextFieldProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBTextFieldInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          variant="outlined"
          onChange={this.handleChange}
          defaultValue={this.props.field.value}
        />
      );
    }

    private handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { form, field } = this.props;
      form.setFieldValue(field.name, event.target.value);
    }
  }

  return withFormik(HOC);
}
