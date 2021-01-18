import { get } from "lodash";
import React from "react";
import { toastError } from "../../../components/notifications";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorOptionProps } from "../../types/validation/validatorOption";
import { withOnChange } from "../common/withOnChange";

export const withIndicatorOnChange = <T extends FBValidatorOptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const component = ({
    indicator,
    onChange,
    field,
    ...props
  }: T) => {

    const indicatorOnChange = (
      ev: React.ChangeEvent<{ value: any; checked: boolean }>,
      value: any = undefined,
    ) => {
      if (!field && !indicator) {
        return;
      }
      onChange && onChange(ev, value);
      const delimiter = get(indicator, "validatorDelimiter");
      if (!delimiter) {
        return toastError("Indicator must have delimiter defined");
      }
      if (indicator?.optionId === "4") {
        value = value.documentTypeAcronym;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      FBValidatorStore.indicatorValues[field!.name][`${delimiter}`] = value;
    };

    return Component({
      ...(props as T),
      indicator,
      indicatorOnChange,
    });
  };

  return withOnChange((props: T) => component(props));
};
