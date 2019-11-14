import React from "react";
import { FBFieldComponent } from "../defaults/editor";
import FBStore from "../stores/FBStore";
import { FBValidatorProps } from "../types/validator";

export const withValidator = <T extends FBValidatorProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    const schemaRenderer = () =>
      (props.schema || []).map((schemaItem, i) => {
        const { type, fieldName } = schemaItem;
        const name = fieldName || `validator_${i}_field_${type}`;
        const InputType = FBFieldComponent[type as string];
        return (
          <InputType
            key={`validator_${name}_${i}`}
            {...schemaItem}
            {...FBStore.fieldMode}
          />
        );
      });

    return Component({
      ...props,
      children: schemaRenderer(),
    });
  };
};
