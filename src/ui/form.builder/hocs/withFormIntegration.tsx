import { Form, FormikProps } from "formik";
import { observer } from "mobx-react";
import React from "react";
import formBuilderStore from "../stores/FBStore";
import { FBFormInputProps } from "../types/formik";

export function withFormIntegration<T extends FormikProps<FBFormInputProps>>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<T> {

    public render() {
      // this.props.values.formInput = formBuilderStore.formInput;
      return (
        <Component
          {...this.props as T}
        />
      );
    }
  }

  return HOC;
}
