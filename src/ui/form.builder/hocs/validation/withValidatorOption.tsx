import _ from "lodash";
import React from "react";
import { withFormik } from "../../../components/hoc/formik";
import { FBFieldComponent } from "../../defaults/editor";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBTemplateSchema } from "../../types/store";
import { FBValidatorOptionProps } from "../../types/validation/validatorOption";

export const withValidatorOption = <T extends FBValidatorOptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withFormik((props: T) => {
    const [checked, setChecked] = React.useState(false);
    const { indicators, form, field } = props;

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = field;
      const { indicatorValues } = FBValidatorStore;
      const value = ev.target.checked;

      if (value) {
        return FBValidatorStore.indicatorValues[name] = {};
      }
      FBValidatorStore.indicatorValues = _.omit(indicatorValues, name);
      setChecked(value);
    };

    function isEvent(
      value: React.ChangeEvent<HTMLInputElement>,
    ): value is React.ChangeEvent<HTMLInputElement> {
      return (
        (value as React.ChangeEvent<HTMLInputElement>).target !== undefined
      );
    }

    const optionOnChange = (
      indicator: Partial<FBTemplateSchema>,
      name: string,
    ) => (trigger: any) => {
      let value: any;
      const delimiter = indicator.validatorDelimiter;
      if (!delimiter) {
        return alert("Indicator must have delimiter defined");
      }
      switch (true) {
        case trigger && isEvent(trigger):
          const target = (trigger as React.ChangeEvent<HTMLInputElement>)
            .target;
          value = target.type === "checkbox" ? target.checked : target.value;
          break;
        default:
          value = trigger;
      }
      form.setFieldValue(name, value);
      FBValidatorStore.indicatorValues[field.name][`${delimiter}`] = value;
    };

    const indicatorRenderer = (): React.ReactNode[] | undefined => {
      return (indicators || []).map(
        ({ type, ...props }: Partial<FBTemplateSchema>, index) => {
          if (!type) {
            return;
          }
          const uuidv4 = require("uuid/v4");
          const name = uuidv4();
          const InputType = FBFieldComponent[type];
          return (
            <InputType
              key={`indicator-${index}-${type}`}
              name={`rule-${name}`}
              {...props}
              onChange={optionOnChange(props, name)}
            />
          );
        },
      );
    };

    return Component({
      ...props,
      onChange,
      checked,
      indicatorElements: indicatorRenderer(),
    });
  });
};
