import _ from "lodash";
import React from "react";
import FBValidator from "../../components/validation/FBValidator";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";

export const withValidatorForm = <T extends FBValidatorFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {

    const validators =
      _.map(validatorCollection.data(), (validator, index) => {
        const { applicableIn } = validator;
        const activeType = FBValidatorStore.activeValidatorType;

        if (_.isEmpty(applicableIn) || (applicableIn || []).includes(activeType || "")) {
          return (
            <FBValidator
              key={`validator-${index}-${validator.name}`}
              index={index + 1}
              {...validator}
            />
          );
        }
      });

    const onCustomClick = () => {
      alert("add");
    }

    return Component({
      ...props,
      validators,
      onCustomClick,
    });
  };
};
