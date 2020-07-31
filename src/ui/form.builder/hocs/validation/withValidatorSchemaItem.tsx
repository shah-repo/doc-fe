import { observer } from "mobx-react";
import React from "react";
import { FBFieldComponent } from "../../defaults/editor";
import { FBValidatorSchemaItemProps } from "../../types/validation/validatorSchemaItem";

export const withValidatorSchemaItem = <T extends FBValidatorSchemaItemProps>(
  Component: React.FunctionComponent<T>,
) => observer((props: T) => {
  const InputType = props.type && FBFieldComponent[props.type];
  return Component({
    ...props,
    InputType,
  });
},
);
