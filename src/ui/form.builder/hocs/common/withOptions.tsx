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
    includeContext,
    name,
    ...props
  }: T) => {

    function mapStringOption(): T["options"] {
      const splitArray = _.split(props.options as string, "\n");
      return _.map(splitArray, (option) => ({
        [optionValueKey]: `${name}-${_.toLower(option).replace(" ", "-")}-option`,
        [optionLabelKey]: option,
      }));
    }

    function unionNoneOption(options: any[]): T["options"] {
      return _.union([{
        [optionValueKey]: "",
        [optionLabelKey]: "fields.select.none",
      }], options);
    }

    function unionContextOption(options: any[]): T["options"] {
      return _.union(options, [{
        [optionValueKey]: `${name}-other`,
        [optionLabelKey]: "form.builder.other",
      }]);
    }

    const optionsSet = (): T["options"] => {
      let options = props.options || "";
      _.isString(options) && (options = mapStringOption());
      includeNone && (options = unionNoneOption(options as any[]));
      includeContext && (options = unionContextOption(options as any[]));
      return options;
    };

    return Component({
      ...props as T,
      options: optionsSet(),
      includeNone,
      optionLabelKey,
      optionValueKey,
      includeContext,
      name,
    });
  };
};
