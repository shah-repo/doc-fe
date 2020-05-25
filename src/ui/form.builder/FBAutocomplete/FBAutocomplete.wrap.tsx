import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBAutocompleteProps } from ".";
import { FB, FBOptionValueType } from "..";
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
    optionId,
    type,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    function getDefault() {
      function  sliceValue(value: any) {
        return multiple
          ? _.filter(options, (o) => (value || formValue).includes(o[optionValueKey]))
          : _.find(options, { [optionValueKey]: value || formValue });
      }

      const objectValue: Record<FBOptionValueType, () => any> = {
        object: () => formValue,
        key: () => sliceValue(formValue),
        id: (value?: any) =>  {
          const slicedValue = multiple
            ? _.map(value || formValue, optionValueKey)
            : _.get(value || formValue, optionValueKey);
          return sliceValue(slicedValue);
        },
      };
      return objectValue[optionValueType]();
    }

    if (placeholder && isTranslation(placeholder)) {
      placeholder = intl.formatMessage({ id: placeholder });
    }

    (type !== "autocompleteasync" && options && formValue && !_.isEmpty(formValue)) && (defaultValue = getDefault());

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
      optionId,
      name,
      type,
    });
  };

  return (props: T) => Comp(props);
};
