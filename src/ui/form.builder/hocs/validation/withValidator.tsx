import { get, isUndefined, map, omit } from "lodash";
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
      FBValidatorStore.indicatorValues = omit(indicatorValues, fieldName);
    };

    const indicatorAfterChange = (fieldName: string, value: any) => {
      const propname = get(props, "name");
      FBValidatorStore.indicatorValues[propname][":"] = value;
      FBValidatorStore.formValues[fieldName] = value;
    };

    const indicatorElements = (): React.ReactNode[] | undefined => map(indicators, (
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return !isUndefined(get(FBValidatorStore.indicatorValues, props.name!));
    }

    return Component({
      ...(props as T),
      afterChange,
      indicatorElements: doRenderIndicators() && indicatorElements(),
    });
  };

  return observer((props: T) => component(props));
};
