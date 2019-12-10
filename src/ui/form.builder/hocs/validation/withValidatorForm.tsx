import React from "react";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import _ from "lodash";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import FBValidator from "../../components/validation/FBValidator";

export const withValidatorForm = <T extends FBValidatorFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    
    const validators =
      _.map(validatorCollection.data(), (validator, index) => (
          <FBValidator
            key={`validator-${index}-${validator.name}`}
            index={index + 1}
            {...validator}
          />
      ));

    return Component({
      ...props,
      validators,
    });
  };
};
