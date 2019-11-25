import React from "react";
import FBValidatorOption from "../../components/validation/FBValidatorOption";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import { FBValidatorProps } from "../../types/validation/validator";

export const withValidator = <T extends FBValidatorProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    const validatorRenderer = () =>
      validatorCollection
        .data()
        .map((validator, index) => (
          <FBValidatorOption
            key={`validator-${index}-${validator.name}`}
            {...validator}
          />
        ));

    return Component({
      ...props,
      validators: validatorRenderer(),
    });
  };
};
