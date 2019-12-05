import _ from "lodash";
import React from "react";
import { FBOptionProps } from "../../types/common";

export const withOptions = <T extends FBOptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    includeNone = false,
    optionLabelKey = "text",
    optionValueKey = "value",
    ...props
  }: T) => {

    function mapStringOption(): T["options"] {
      const splitArray = _.split(props.options as string, "\n");
      return _.map(splitArray, (option, index) => ({
        [optionValueKey]: `check-option-${index}`,
        [optionLabelKey]: option,
      }));
    }

    function unionArrayOption(): T["options"] {
      return _.union([{
        [optionValueKey]: "",
        [optionLabelKey]: "fields.select.none",
      }], props.options);
    }

    const optionsSet = (): T["options"] => {
      let options = props.options || "";
      _.isString(options) && (options = mapStringOption());
      includeNone && (options = unionArrayOption());
      return options;
    };

    return Component({
      ...props as T,
      options: optionsSet(),
      includeNone,
      optionLabelKey,
      optionValueKey,
    });
  };
};
