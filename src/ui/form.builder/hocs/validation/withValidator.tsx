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
      FBValidatorStore.formValues[fieldName] = value;
      if (value) {
        return FBValidatorStore.indicatorValues[fieldName] = {};
      }
      FBValidatorStore.indicatorValues = _.omit(indicatorValues, fieldName);
    };

    const indicatorAfterChange = (fieldName: string, value: any) => {
      const propname = _.get(props, "name");
      FBValidatorStore.indicatorValues[propname][":"] = value;
      FBValidatorStore.formValues[fieldName] = value;
    };

    const indicatorElements = (): React.ReactNode[] | undefined => _.map(indicators, (
      { type, ...indicatorProps }: Partial<FBValidatorIndicatorProps>,
      index,
    ) => {
      const name = `${props.name}${index}`;
      const InputType = FBFieldComponent[type || ""];
      return (
        <InputType
          key={`indicator-${index}-${type}`}
          name={name}
          {...indicatorProps}
          afterChange={indicatorAfterChange}
          validatorFieldName={props.name}
        />
      );
    });

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
