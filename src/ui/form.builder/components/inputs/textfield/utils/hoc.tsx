import React from "react";
import { withFormik } from "../../../../../components/hoc/formik";
import { withLabelRenderer } from "../../../common/hoc/withLabelRenderer";
import { Subtract } from "../../../common/utils/types";
import { FBTextFieldInjectedProps, FBTextFieldProps } from "./types";

export function withTextFieldDefaults<T extends FBTextFieldProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBTextFieldInjectedProps>> {

    public render() {
      const { field, label } = this.props;
      return (
        <Component
          fullWidth={true}
          {...this.props as T}
          variant="outlined"
          onChange={this.handleChange()}
          value={field.value}
        />
      );
    }

    private handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { form, field } = this.props;
      form.setFieldValue(field.name, event.target.value);
    }
  }

  return withFormik(withLabelRenderer(HOC));
}
