import _ from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { FBFieldComponent } from "../../defaults/editor";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorIndicatorProps, FBValidatorProps } from "../../types/validation/validator";

export const withValidator = <T extends FBValidatorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const component = ({
    indicators,
    ...props
  }: T) => {

    const afterChange = (fieldName: string, value: boolean) => {
      const { indicatorValues } = FBValidatorStore;
      if (value) {
        return FBValidatorStore.indicatorValues[fieldName] = {};
      }
      FBValidatorStore.indicatorValues = _.omit(indicatorValues, fieldName);
    };

    const indicatorAfterChange = (fieldName: string, value: any) => {
      alert(`${fieldName}- ${value}`);
    };

    const indicatorElements = (): React.ReactNode[] | undefined => {
      return _.map(indicators, (
        { type, ...props }: Partial<FBValidatorIndicatorProps>,
        index,
      ) => {
        const name = `${props}${index}`;
        const InputType = FBFieldComponent[type || ""];
        return (
          <InputType
            key={`indicator-${index}-${type}`}
            name={name}
            {...props}
            afterChange={indicatorAfterChange}
          />
        );
      });
    };

    function doRenderIndicators(): boolean {
      if (!props.name) {
        return false;
      }
      return !_.isUndefined(_.get(FBValidatorStore.indicatorValues, props.name!));
    }

    return Component({
      ...(props as T),
      afterChange,
      indicatorElements: doRenderIndicators() && indicatorElements(),
    });
  };

  return observer((props: T) => component(props));
};
