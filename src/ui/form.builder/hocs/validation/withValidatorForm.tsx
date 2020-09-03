import { find, isEmpty, isUndefined, map, size } from "lodash";
import React from "react";
import FBValidator from "../../components/validation/FBValidator";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import FBStore from "../../stores/ui/FBStore";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";

export const withValidatorForm = <T extends FBValidatorFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = (props: T) => {

    const validators =
      map(validatorCollection.data(), (validator, index) => {
        const { applicableIn } = validator;
        const activeType = FBValidatorStore.activeValidatorType;
        let renderEl = (isEmpty(applicableIn) || (applicableIn || []).includes(activeType || ""));

        const isRelational = find(validator.indicators, { type: "schemaSelect" });

        if (!isUndefined(isRelational) && size(FBStore.getSchema()) === 0) {
          renderEl = false;
        }

        if (renderEl) {
          return (
            <FBValidator
              key={`validator-${index}-${validator.name}`}
              index={index + 1}
              {...validator}
            />
          );
        }
      });

    return Component({
      ...props,
      validators,
    });
  };

  return (props: T) => Comp(props);
};
