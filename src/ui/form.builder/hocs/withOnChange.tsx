import { get, map, values } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import Validator from "validatorjs";
import { SelectOption } from "../../components/forms/fields/Select";
import { withFormik } from "../../components/hoc/formik";
import FBStore from "../stores/ui/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBOnChangeProps, Subtract } from "../types/common";

const customValidators = () => {

  Validator.register(
    "", () => true, "",
  );

  Validator.register(
    "required_document_status",
    (value, requirement) => get(value, "status") === requirement,
    "The :attribute is not in required state.",
  );

  Validator.register(
    "required_document_type",
    (value, requirement) => get(value, "document.documentType.documentTypeAcronym") === requirement,
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
          error={Boolean(FBValidatorStore.errors[name])}
          helperText={FBValidatorStore.errors[name] || ""}
        />
      );
    }

    private isEvent(
      value: React.ChangeEvent<HTMLInputElement>,
    ): value is React.ChangeEvent<HTMLInputElement> {
      return (
        (value).target !== undefined
      );
    }

    private handleChange = (trigger: any, newValue?: SelectOption[]) => {
      const { form, field } = this.props;
      let value: any;

      if (newValue && newValue.length > 0) {
        value = [newValue[0].value];
      } else {
        let target;
        switch (true) {
          case trigger && this.isEvent(trigger):
            target = (trigger as React.ChangeEvent<HTMLInputElement>)
              .target;
            value = target.type === "checkbox" ? target.checked : target.value;
            break;
          default:
            value = trigger;
        }
      }

      if (field.name.includes("applicableOn")) {
        // form.setFieldValue("applicableOn", value ? ["ON_STATE_TO_IN_REVIEW"] : []);
        FBValidatorStore.applicableOn = value;
      } else {
        form.setFieldValue(field.name, value);
      }

      form.values[field.name] = value; // workaround for validtors :/
      this.validate();

      if (FBStore.mode === "form") {
        FBStore.setValues({
          ...FBStore.values,
          [field.name]: value,
        });
      }
    };

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
        FBValidatorStore.errors = {};

        map(errors, (v: string, k: string) =>
          FBValidatorStore.errors[k] = values(v).join("\n"),
        );
      });

      validator.passes(() => {
        FBValidatorStore.errors = {};
      });
    };
  }

  return withFormik(observer(HOC));
}
