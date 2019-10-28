import React from "react";
import { withFormik } from "../../components/hoc/formik";
import formBuilderStore from "../stores/FBStore";
import { FBOnChangeProps, Subtract } from "../types/common";

export function withOnChange<T extends FBOnChangeProps>(
  Component: React.ComponentType<T>,
) {
  class HOC extends React.Component<
    Subtract<T, Pick<FBOnChangeProps, "value">>
  > {
    public render() {
      const { field, onChange } = this.props;
      return (
        <Component
          {...(this.props as T)}
          onChange={(onChange && onChange()) || this.handleChange()}
          value={(field.value && field.value) || null}
        />
      );
    }

    private isEvent(
      value: React.ChangeEvent<HTMLInputElement>,
    ): value is React.ChangeEvent<HTMLInputElement> {
      return (
        (value as React.ChangeEvent<HTMLInputElement>).target !== undefined
      );
    }

    private handleChange = () => (trigger: any) => {
      const { form, field } = this.props;
      let value: any;

      switch (true) {
        case trigger && this.isEvent(trigger):
          const target = (trigger as React.ChangeEvent<HTMLInputElement>)
            .target;
          value = target.type === "checkbox" ? target.checked : target.value;
          break;
        default:
          value = trigger;
      }
      form.setFieldValue(field.name, value);

      if (formBuilderStore.mode === "design") {
        return;
      }
      formBuilderStore.values = {
        ...formBuilderStore.values,
        [field.name as string]: value,
      };
    };
  }

  return withFormik(HOC);
}
