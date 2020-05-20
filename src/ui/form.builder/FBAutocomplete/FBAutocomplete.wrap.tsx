import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBAutocompleteProps } from ".";
import { FB } from "..";
import { isTranslation } from "../../translations/types";

export const withFBAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    optionLabelKey = "text",
    optionValueKey = "value",
    optionValueType = "key",
    placeholder,
    getOptionLabel,
    multiple,
    name,
    defaultValue,
    options,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const value = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    if (placeholder && isTranslation(placeholder)) {
      placeholder = intl.formatMessage({ id: placeholder });
    }

    if (options && value && !_.isEmpty(value)) {
      if (optionValueType === "key") {
        defaultValue = multiple
          ? _.filter(options, (o) => _.includes(value, o[optionValueKey]))
          : _.find(options, { [optionValueKey]: value });
      } else {
        defaultValue = value;
      }
    }

    !getOptionLabel && (getOptionLabel = (option) => {
      let optionText = _.get(option, optionLabelKey);
      if (isTranslation(optionText)) {
        optionText = intl.formatMessage({ id: optionText });
      }
      return optionText;
    });

    return Component({
      ...(props as T),
      getOptionLabel,
      options,
      defaultValue,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      placeholder,
      multiple,
      name,
    });
  };

  return (props: T) => Comp(props);
};
