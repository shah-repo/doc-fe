import _ from "lodash";
import React from "react";
import { FBAutocompleteProps } from ".";
import FBStore from "../stores/ui/FBStore";

export const withFBAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    optionLabelKey = "text",
    optionValueKey = "value",
    optionValueType = "key",
    getOptionLabel,
    multiple,
    name,
    defaultValue,
    options,
    ...props
  }: T) => {

    const value = FBStore.getValue(name);

    if (value && optionValueType === "key" && optionValueKey) {
      defaultValue = multiple
        ? _.filter(options, (o) => _.includes(value, _.get(o, optionValueKey)))
        : _.find(options, { [optionValueKey]: value });
    }

    !getOptionLabel && (getOptionLabel =
      (option) => optionLabelKey && _.get(option, optionLabelKey)
    );

    return Component({
      ...(props as T),
      getOptionLabel,
      options,
      defaultValue,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      multiple,
      name,
    });
  };

  return (props: T) => Comp(props);
};
