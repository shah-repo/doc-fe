import { Form, FormikConfig } from "formik";
import React from "react";
import { Subtract } from "../../common/utils/types";
import { FBFormInjectedProps } from "./types";

export function withFormDefaults<T extends FormikConfig<any>>(
  Component: React.ComponentType<T>,
) {

  return class extends React.Component<Subtract<T, FBFormInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          render={this.renderForm}
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
