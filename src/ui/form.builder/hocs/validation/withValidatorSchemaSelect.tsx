import { observer } from "mobx-react";
import React from "react";
import { withFormik } from "../../../components/hoc/formik";
import { FBFieldComponent } from "../../defaults/editor";
import FBStore from "../../stores/ui/FBStore";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorSchemaSelectProps } from "../../types/validation/validatorSchemaSelect";

export const withValidatorSchemaSelect = <
  T extends FBValidatorSchemaSelectProps
>(
  Component: React.FunctionComponent<T>,
) => {
  return withFormik(
    observer((props: T) => {
      const [SchemaInputType, setSchemaItem] = React.useState<
        React.ReactNode | undefined
      >(undefined);
      const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const name = ev.target.value;
        const schemaItemProps = FBStore.getSchemaItemByName(name || "");
        const { type } = schemaItemProps || {};
        if (type && props.hasSchemaItem) {
          const InputType = FBFieldComponent[type];
          setSchemaItem(
            <InputType
              {...schemaItemProps}
              label="Has value:"
              onChange={onItemChange}
              name={`${props.name}-item`}
            />,
          );
        }
        FBValidatorStore.indicatorValues[props.fieldName || ""][":"] = name;
      };

      function isEvent(
        value: React.ChangeEvent<HTMLInputElement>,
      ): value is React.ChangeEvent<HTMLInputElement> {
        return (
          (value as React.ChangeEvent<HTMLInputElement>).target !== undefined
        );
      }

      const onItemChange = (trigger: any) => {
        const { form } = props;
        let value: any;
        switch (true) {
          case trigger && isEvent(trigger):
            const target = (trigger as React.ChangeEvent<HTMLInputElement>)
              .target;
            value = target.type === "checkbox" ? target.checked : target.value;
            break;
          default:
            value = trigger;
        }
        form.setFieldValue(`${props.name}-item`, value);
        FBValidatorStore.indicatorValues[props.fieldName || ""][","] = value;
      };

      return Component({
        ...props,
        onChange,
        SchemaInputType,
      });
    }),
  );
};
