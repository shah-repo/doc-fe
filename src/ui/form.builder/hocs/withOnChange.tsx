import _ from "lodash";
import React from "react";
import Validator from "validatorjs";
import { withFormik } from "../../components/hoc/formik";
import FBStore from "../stores/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBOnChangeProps, Subtract } from "../types/common";
import { SelectOption } from "../../components/forms/fields/Select";

const customValidators = () => {

  Validator.register(
    "", () => {
      return true;
    }, "",
  );

  Validator.register(
    "required_document_status",
    (value, requirement) => {
      return _.get(value, "status") === requirement;
    },
    "The :attribute is not in required state.",
  );

  Validator.register(
    "required_document_type",
    (value, requirement) => {
      return _.get(value, "document.documentType.documentTypeAcronym") === requirement;
    },
    "The :attribute is not required type.",
  );
};

customValidators();

export function withOnChange<T extends FBOnChangeProps>(
  Component: React.ComponentType<T>,
) {
  class HOC extends React.Component<
    Subtract<T, Pick<FBOnChangeProps, "value">>
  > {
    public render() {
      const { field, onChange } = this.props;
      const { name } = field;

      return (
        <Component
          {...(this.props as T)}
          onChange={((onChange && onChange) || this.handleChange)}
          value={(field.value && field.value) || null}
          error={FBValidatorStore.hasError(name)}
          helperText={FBValidatorStore.errorText(name)}
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

    private handleChange = (trigger: any, newValue?: SelectOption[]) => {
      const { form, field } = this.props;
      let value: any;

      if (newValue && newValue.length > 0) {
        value = [newValue[0].value];
      } else {
        switch (true) {
          case trigger && this.isEvent(trigger):
            const target = (trigger as React.ChangeEvent<HTMLInputElement>)
              .target;
            value = target.type === "checkbox" ? target.checked : target.value;
            break;
          default:
            value = trigger;
        }
      }

      form.setFieldValue(field.name, value);
      form.values[field.name] = value; // workaround for validtors :/
      this.validate();

      if (FBStore.mode === "form") {
        FBStore.setValues({
          ...FBStore.values,
          [field.name as string]: value,
        });
      }
    }

    private validate = () => {
      const { form, field } = this.props;
      const { name } = field;
      const rules = FBValidatorStore.getRulesBy(name);
      if (!rules) {
        return;
      }

      const validator = new Validator(
          form.values,
          rules,
      );

      validator.setAttributeNames(
        FBValidatorStore.getValidatorNames(),
      );

      validator.fails(() => {
        const errors = validator.errors.all();

        _.map(errors, (v: string, k: string) =>
          FBValidatorStore.errors[k] = _.values(v).join("\n"),
        );
      });

      validator.passes(() => {
        FBValidatorStore.errors = {};
      });
    }
  }

  return withFormik(HOC);
}
