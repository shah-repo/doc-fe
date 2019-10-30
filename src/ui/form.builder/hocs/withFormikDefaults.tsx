import { Form } from "formik";
import React from "react";
import { FBFormikProps } from "../types/formik";

export function withFormikDefaults<T extends FBFormikProps>(
  Component: React.ComponentType<T>,
) {

  return class extends React.Component<T> {

    public render() {
      return (
        <Component
          render={this.props.children && this.renderForm}
          {...this.props as T}
        />
      );
    }

    private renderForm = () => (
      <Form>
        {this.props.children}
      </Form>
    )
  };
}
