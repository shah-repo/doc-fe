
import { observer } from "mobx-react";
import React from "react";
import { FBFieldComponent } from "../../defaults/editor";
import FBStore from "../../stores/ui/FBStore";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorSchemaSelectProps } from "../../types/validation/validatorSchemaSelect";

export const withValidatorSchemaSelect = <
  T extends FBValidatorSchemaSelectProps
>(
  Component: React.FunctionComponent<T>,
) => {
  return observer((props: T) => {
      const [SchemaInputType, setSchemaItem] = React.useState<
        React.ReactNode | undefined
      >(undefined);

      const afterChange = (fieldName: string, value: any) => {

        const schemaItemProps = FBStore.getSchemaItemByName(value || "");
        const { type } = schemaItemProps || {};
        if (type && props.hasSchemaItem) {
          const InputType = FBFieldComponent[type];
          setSchemaItem(
            <InputType
              {...schemaItemProps}
              label="Has value:"
              afterChange={onItemChange}
              name={value}
            />,
          );
        }
        FBValidatorStore.indicatorValues[props.validatorFieldName || ""][":"] = value;
        FBValidatorStore.formValues[fieldName] = value;
      };

      const onItemChange = (fieldName: string, value: any) => {
        FBValidatorStore.indicatorValues[props.validatorFieldName || ""][","] = value;
      };

      return Component({
        ...props,
        afterChange,
        SchemaInputType,
      });
    },
  );
};
