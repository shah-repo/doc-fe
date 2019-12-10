import _ from "lodash";
import React from "react";
import FBValidator from "../../components/validation/FBValidator";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";

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
