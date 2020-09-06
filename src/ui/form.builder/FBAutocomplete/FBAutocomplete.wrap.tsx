import { filter, find, get, includes, isEmpty, map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBAutocompleteProps } from ".";
import { FB, FBOptionValueType } from "..";
import { isTranslation } from "../../translations/types";

export const withFBAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    getOptionDisabled,
    getOptionLabel,
    groupBy,
    optionLabelKey = "text",
    optionValueKey = "value",
    optionValueType = "key",
    groupByKey,
    disabledOptions,
    placeholder,
    multiple,
    name,
    defaultValue,
    options,
    optionId,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    function getDefault() {
      function  sliceValue(value: any) {
        return multiple
          ? filter(options, (o) => (value || formValue).includes(o[optionValueKey]))
          : find(options, { [optionValueKey]: value || formValue });
      }

      const objectValue: Record<FBOptionValueType, () => any> = {
        object: () => formValue,
        key: () => sliceValue(formValue),
        id: (value?: any) =>  {
          const slicedValue = multiple
            ? map(value || formValue, optionValueKey)
            : get(value || formValue, optionValueKey);
          return sliceValue(slicedValue);
        },
      };
      return objectValue[optionValueType]();
    }

    if (placeholder && isTranslation(placeholder)) {
      placeholder = intl.formatMessage({ id: placeholder });
    }

    (!optionId && options && formValue && !isEmpty(formValue)) && (defaultValue = getDefault());

    !getOptionLabel && (getOptionLabel = (option) => {
      let optionText = get(option, optionLabelKey);
      if (isTranslation(optionText)) {
        optionText = intl.formatMessage({ id: optionText });
      }
      return optionText;
    });

    groupByKey && (groupBy = (option) => option[groupByKey]);

    disabledOptions && (getOptionDisabled = (option) =>
      includes(disabledOptions, option.id)
    );

    return Component({
      ...(props as T),
      getOptionDisabled,
      getOptionLabel,
      groupBy,
      options,
      defaultValue,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      placeholder,
      multiple,
      optionId,
      name,
    });
  };

  return (props: T) => Comp(props);
};
