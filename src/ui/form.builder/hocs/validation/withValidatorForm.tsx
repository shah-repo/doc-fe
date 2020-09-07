import _ from "lodash";
import React from "react";
import FBValidator from "../../components/validation/FBValidator";
import validatorCollection from "../../stores/domain/collections/FBValidatorCollection";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import FBStore from "../../stores/ui/FBStore";

export const withValidatorForm = <T extends FBValidatorFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = (props: T) => {

    const validators =
      _.map(validatorCollection.data(), (validator, index) => {
        const { applicableIn } = validator;
        const activeType = FBValidatorStore.activeValidatorType;
        let renderEl = (_.isEmpty(applicableIn) || (applicableIn || []).includes(activeType || ""));

        const isRelational = _.find(validator.indicators, { type: "schemaSelect" });

        if (!_.isUndefined(isRelational) && _.size(FBStore.getSchema()) === 0) {
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
