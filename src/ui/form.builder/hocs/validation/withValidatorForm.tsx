import _ from "lodash";
import React from "react";
import FBValidator from "../../components/validation/FBValidator";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import { withDialogState } from "../withDialogState";

export const withValidatorForm = <T extends FBValidatorFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = (props: T) => {

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
      props.setDialogOpen && props.setDialogOpen();
    };

    return Component({
      ...props,
      validators,
      onCustomClick,
    });
  };

  return withDialogState((props: T) => Comp(props));
};
